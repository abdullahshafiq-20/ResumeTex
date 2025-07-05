import { User, UserPreferences, Email, UserResume } from '../models/userSchema.js';
import { extensionSchema } from '../models/extensionSchema.js';
import { Count } from '../models/countSchema.js';
import mongoose from 'mongoose';
import { emitStatsDashboard } from '../config/socketConfig.js';
/**
 * Helper function to fetch user preferences data
 */
const fetchUserPreferences = async (userId) => {
    const userPreferences = await UserPreferences.find({ userId }).sort({ createdAt: -1 });

    if (!userPreferences || userPreferences.length === 0) {
        return {
            records: [],
            aggregated: {
                totalRecords: 0,
                allSkills: [],
                allProjects: [],
                latestSummary: '',
                latestPreferences: {},
                lastUpdated: null
            }
        };
    }

    const preferencesData = userPreferences.map(pref => ({
        _id: pref._id,
        userId: pref.userId,
        preferences: pref.preferences || {},
        summary: pref.summary || '',
        skills: pref.skills || [],
        projects: pref.projects || [],
        createdAt: pref.createdAt,
        updatedAt: pref.updatedAt
    }));

    const aggregatedData = {
        totalRecords: preferencesData.length,
        allSkills: [...new Set(preferencesData.flatMap(p => p.skills))],
        allProjects: preferencesData.flatMap(p => p.projects),
        latestSummary: preferencesData[0]?.summary || '',
        latestPreferences: preferencesData[0]?.preferences || {},
        lastUpdated: preferencesData[0]?.updatedAt || null
    };

    return {
        records: preferencesData,
        aggregated: aggregatedData
    };
};

/**
 * Helper function to fetch user activity timeline
 */
const fetchUserActivityTimeline = async (userId, limit = 10) => {
    const [recentResumes, recentEmails, recentPosts] = await Promise.all([
        UserResume.find({ userId })
            .select('resume_title createdAt file_type')
            .sort({ createdAt: -1 })
            .limit(limit),
        
        Email.find({ userId })
            .select('subject createdAt isEmailSent to')
            .sort({ createdAt: -1 })
            .limit(limit),
        
        extensionSchema.find({ userId: userId.toString() })
            .select('jobTitle timestamp content')
            .sort({ timestamp: -1 })
            .limit(limit)
    ]);

    const activities = [
        ...recentResumes.map(resume => ({
            type: 'resume',
            title: `Created resume: ${resume.resume_title}`,
            date: resume.createdAt,
            metadata: { fileType: resume.file_type }
        })),
        ...recentEmails.map(email => ({
            type: 'email',
            title: `${email.isEmailSent ? 'Sent' : 'Generated'} email: ${email.subject}`,
            date: email.createdAt,
            metadata: { recipient: email.to, sent: email.isEmailSent }
        })),
        ...recentPosts.map(post => ({
            type: 'linkedin',
            title: `Extracted LinkedIn post: ${post.jobTitle || 'Job posting'}`,
            date: post.timestamp,
            metadata: { preview: post.content?.substring(0, 100) + '...' }
        }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);

    return activities;
};

/**
 * Helper function to fetch comparison stats
 */
const fetchComparisonStats = async (userId) => {
    const [userResumeCount, userEmailCount, userPostCount] = await Promise.all([
        UserResume.countDocuments({ userId }),
        Email.countDocuments({ userId }),
        extensionSchema.countDocuments({ userId: userId.toString() })
    ]);

    const [avgResumes, avgEmails, avgPosts] = await Promise.all([
        UserResume.aggregate([
            { $group: { _id: '$userId', count: { $sum: 1 } } },
            { $group: { _id: null, average: { $avg: '$count' } } }
        ]),
        Email.aggregate([
            { $group: { _id: '$userId', count: { $sum: 1 } } },
            { $group: { _id: null, average: { $avg: '$count' } } }
        ]),
        extensionSchema.aggregate([
            { $group: { _id: '$userId', count: { $sum: 1 } } },
            { $group: { _id: null, average: { $avg: '$count' } } }
        ])
    ]);

    return {
        resumes: {
            user: userResumeCount,
            average: Math.round(avgResumes[0]?.average || 0),
            percentile: calculatePercentile(userResumeCount, avgResumes[0]?.average || 0)
        },
        emails: {
            user: userEmailCount,
            average: Math.round(avgEmails[0]?.average || 0),
            percentile: calculatePercentile(userEmailCount, avgEmails[0]?.average || 0)
        },
        posts: {
            user: userPostCount,
            average: Math.round(avgPosts[0]?.average || 0),
            percentile: calculatePercentile(userPostCount, avgPosts[0]?.average || 0)
        }
    };
};

/**
 * Helper function to calculate user activity score
 */
const calculateActivityScore = ({ resumes, emails, posts, onboarded, extensionConnected }) => {
    let score = 0;
    
    score += Math.min(resumes * 10, 50); // Max 50 points for resumes
    score += Math.min(emails * 5, 30); // Max 30 points for emails
    score += Math.min(posts * 2, 20); // Max 20 points for LinkedIn posts
    
    if (onboarded) score += 10;
    if (extensionConnected) score += 10;
    
    return Math.min(score, 100); // Cap at 100
};

/**
 * Helper function to calculate percentile
 */
const calculatePercentile = (userValue, average) => {
    if (average === 0) return userValue > 0 ? 100 : 50;
    const ratio = userValue / average;
    if (ratio >= 2) return 90;
    if (ratio >= 1.5) return 75;
    if (ratio >= 1) return 60;
    if (ratio >= 0.5) return 40;
    return 25;
};

/**
 * MAIN API CONTROLLER - Get all user statistics in one call
 */
export const getAllUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;

        // Parallel queries for better performance
        const [
            userInfo,
            userPreferences,
            resumeStats,
            emailStats,
            linkedInStats,
            globalCount
        ] = await Promise.all([
            User.findById(userId).select('name email subscribed isExtensionConnected onboarded createdAt'),
            UserPreferences.findOne({ userId }),
            UserResume.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalResumes: { $sum: 1 },
                        fileTypes: { $push: '$file_type' },
                        latestResume: { $max: '$createdAt' }
                    }
                }
            ]),
            Email.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalEmails: { $sum: 1 },
                        emailsGenerated: { 
                            $sum: { $cond: ['$isEmailGenerated', 1, 0] } 
                        },
                        emailsSent: { 
                            $sum: { $cond: ['$isEmailSent', 1, 0] } 
                        },
                        latestEmail: { $max: '$createdAt' }
                    }
                }
            ]),
            extensionSchema.aggregate([
                { $match: { userId: userId.toString() } },
                {
                    $group: {
                        _id: null,
                        totalPosts: { $sum: 1 },
                        totalHashtags: { $sum: { $size: '$extractedHashtags' } },
                        totalUrls: { $sum: { $size: '$extractedUrls' } },
                        totalEmails: { $sum: { $size: '$extractedEmails' } },
                        latestPost: { $max: '$timestamp' },
                        jobTitles: { $push: '$jobTitle' }
                    }
                }
            ]),
            Count.findOne()
        ]);

        // Get additional data using helper functions
        const [preferencesData, activityTimeline, comparisonStats] = await Promise.all([
            fetchUserPreferences(userId),
            fetchUserActivityTimeline(userId, limit),
            fetchComparisonStats(userId)
        ]);

        // Process file types distribution
        const fileTypeDistribution = {};
        if (resumeStats[0]?.fileTypes) {
            resumeStats[0].fileTypes.forEach(type => {
                fileTypeDistribution[type] = (fileTypeDistribution[type] || 0) + 1;
            });
        }

        // Process job titles
        const uniqueJobTitles = linkedInStats[0]?.jobTitles 
            ? [...new Set(linkedInStats[0].jobTitles.filter(title => 
                title && title !== "ex: Software Engineer"
              ))]
            : [];

        // Calculate activity score
        const activityScore = calculateActivityScore({
            resumes: resumeStats[0]?.totalResumes || 0,
            emails: emailStats[0]?.totalEmails || 0,
            posts: linkedInStats[0]?.totalPosts || 0,
            onboarded: userInfo?.onboarded || false,
            extensionConnected: userInfo?.isExtensionConnected || false
        });

        // Comprehensive stats response
        const allStats = {
            user: {
                name: userInfo?.name || '',
                email: userInfo?.email || '',
                subscribed: userInfo?.subscribed || false,
                extensionConnected: userInfo?.isExtensionConnected || false,
                onboarded: userInfo?.onboarded || false,
                memberSince: userInfo?.createdAt || null,
                activityScore
            },
            preferences: {
                hasPreferences: !!userPreferences,
                skillsCount: userPreferences?.skills?.length || 0,
                projectsCount: userPreferences?.projects?.length || 0,
                hasSummary: !!(userPreferences?.summary?.trim()),
                ...preferencesData
            },
            resumes: {
                total: resumeStats[0]?.totalResumes || 0,
                fileTypeDistribution,
                latestCreated: resumeStats[0]?.latestResume || null
            },
            emails: {
                total: emailStats[0]?.totalEmails || 0,
                generated: emailStats[0]?.emailsGenerated || 0,
                sent: emailStats[0]?.emailsSent || 0,
                successRate: emailStats[0]?.totalEmails > 0 
                    ? ((emailStats[0]?.emailsSent || 0) / emailStats[0].totalEmails * 100).toFixed(1)
                    : 0,
                latestSent: emailStats[0]?.latestEmail || null
            },
            linkedIn: {
                totalPosts: linkedInStats[0]?.totalPosts || 0,
                totalHashtags: linkedInStats[0]?.totalHashtags || 0,
                totalUrls: linkedInStats[0]?.totalUrls || 0,
                extractedEmails: linkedInStats[0]?.totalEmails || 0,
                uniqueJobTitles: uniqueJobTitles.length,
                jobTitles: uniqueJobTitles.slice(0, 5),
                latestPost: linkedInStats[0]?.latestPost || null
            },
            global: {
                totalUsers: globalCount?.count || 0
            },
            activityTimeline,
            comparison: comparisonStats
        };

        // Emit stats via socket
        emitStatsDashboard(userId, allStats);

        res.status(200).json({
            success: true,
            message: 'All user statistics retrieved successfully',
            data: allStats
        });

    } catch (error) {
        console.error('Error fetching all user stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve user statistics',
            error: error.message
        });
    }
};

/**
 * Update stats dashboard via socket (keep for real-time updates)
 */



export const updateStatsDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = req.body;
        emitStatsDashboard(userId, stats);
        
        res.status(200).json({
            success: true,
            message: 'Stats dashboard updated successfully'
        });
    } catch (error) {
        console.error('Error updating stats dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update stats dashboard',
            error: error.message
        });
    }
};
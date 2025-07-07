import axios from "axios";
import * as cheerio from 'cheerio';
import { UserPreferences } from "../../models/userSchema.js";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
  "Mozilla/5.0 (X11; Linux x86_64)",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X)",
  "Mozilla/5.0 (iPad; CPU OS 13_5 like Mac OS X)"
];

// Simple in-memory cache
const cache = new Map();
const TTL = 1000 * 60 * 60; // 1 hour

function buildUrl(params) {
  const base = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?";
  return base + new URLSearchParams(params).toString();
}

// Helper function to convert time strings to seconds
function convertTimeToSeconds(timeStr) {
  if (!timeStr) return 0;
  
  const timeRegex = /(\d+)([mhd])/i;
  const match = timeStr.match(timeRegex);
  
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'm': return value * 60;           // minutes to seconds
    case 'h': return value * 60 * 60;      // hours to seconds
    case 'd': return value * 60 * 60 * 24; // days to seconds
    default: return 0;
  }
}

// Helper function to parse "ago" time from job posting
function parseAgoTime(agoText) {
  if (!agoText) return 0;
  
  const patterns = [
    /(\d+)\s*minutes?\s*ago/i,
    /(\d+)\s*hours?\s*ago/i,
    /(\d+)\s*days?\s*ago/i,
    /(\d+)\s*weeks?\s*ago/i,
    /(\d+)\s*months?\s*ago/i
  ];
  
  for (const pattern of patterns) {
    const match = agoText.match(pattern);
    if (match) {
      const value = parseInt(match[1]);
      if (pattern.source.includes('minute')) return value * 60;
      if (pattern.source.includes('hour')) return value * 60 * 60;
      if (pattern.source.includes('day')) return value * 60 * 60 * 24;
      if (pattern.source.includes('week')) return value * 60 * 60 * 24 * 7;
      if (pattern.source.includes('month')) return value * 60 * 60 * 24 * 30;
    }
  }
  
  return 0;
}

// Smart keyword generation based on user profile
function generateSmartKeywords(userProfile) {
  const { preferences, skills, summary } = userProfile;
  
  // Extract key terms from preferences
  const preferenceKeywords = preferences.toLowerCase().split(/\s+/);
  
  // Map skills to job-relevant keywords
  const skillKeywords = skills.map(skill => {
    const skillLower = skill.toLowerCase();
    // Map technical skills to job titles
    if (skillLower.includes('machine learning') || skillLower.includes('scikit-learn')) {
      return 'machine learning engineer';
    }
    if (skillLower.includes('node.js') || skillLower.includes('express')) {
      return 'backend developer';
    }
    if (skillLower.includes('python') || skillLower.includes('django') || skillLower.includes('flask')) {
      return 'python developer';
    }
    if (skillLower.includes('nlp') || skillLower.includes('llm')) {
      return 'ai engineer';
    }
    return skillLower;
  });
  
  // Extract experience level from summary
  const summaryLower = summary.toLowerCase();
  let experienceLevel = 'entry level';
  if (summaryLower.includes('1+ years') || summaryLower.includes('transitioning')) {
    experienceLevel = 'entry level';
  } else if (summaryLower.includes('senior') || summaryLower.includes('lead')) {
    experienceLevel = 'senior';
  } else if (summaryLower.includes('2-4 years') || summaryLower.includes('associate')) {
    experienceLevel = 'associate';
  }
  
  // Combine all keywords
  const allKeywords = [...preferenceKeywords, ...skillKeywords].filter(Boolean);
  const uniqueKeywords = [...new Set(allKeywords)];
  
  return {
    primaryKeywords: uniqueKeywords.slice(0, 3).join(' '),
    secondaryKeywords: uniqueKeywords.slice(3, 6).join(' '),
    experienceLevel,
    topSkills: skills.slice(0, 5)
  };
}

// Calculate job match score based on user profile
function calculateJobMatchScore(job, userProfile) {
  let score = 0;
  const { skills, preferences, summary } = userProfile;
  
  const jobText = `${job.position} ${job.company} ${job.location}`.toLowerCase();
  const userSkillsLower = skills.map(s => s.toLowerCase());
  const preferencesLower = preferences.toLowerCase();
  
  // Score based on skill matches in job title/description
  userSkillsLower.forEach(skill => {
    const skillWords = skill.split(/[\s\-\(\)]/);
    skillWords.forEach(word => {
      if (word.length > 2 && jobText.includes(word)) {
        score += 10;
      }
    });
  });
  
  // Score based on preferences match
  const prefWords = preferencesLower.split(/\s+/);
  prefWords.forEach(word => {
    if (word.length > 2 && jobText.includes(word)) {
      score += 15;
    }
  });
  
  // Bonus for remote work (if mentioned in summary/preferences)
  if (jobText.includes('remote') || jobText.includes('work from home')) {
    score += 5;
  }
  
  // Bonus for recent posts
  if (job.agoTimeInSeconds < 86400) { // Less than 24 hours
    score += 5;
  }
  
  return score;
}

// Filter jobs based on ago time
function filterJobsByAgoTime(jobs, agoFilter) {
  if (!agoFilter) return jobs;
  
  const maxAgeInSeconds = convertTimeToSeconds(agoFilter);
  if (maxAgeInSeconds === 0) return jobs;
  
  return jobs.filter(job => {
    return job.agoTimeInSeconds <= maxAgeInSeconds;
  });
}

function parseJobs(html) {
  const $ = cheerio.load(html);
  const jobs = [];

  $('li').each((_, el) => {
    try {
      const position = $(el).find('h3.base-search-card__title').text().trim();
      const company = $(el).find('h4.base-search-card__subtitle').text().trim();
      const location = $(el).find('span.job-search-card__location').text().trim();
      const date = $(el).find('time').attr('datetime') || "";
      const salary = $(el).find('span.job-search-card__salary-info').text().trim() || "Not specified";
      const jobUrl = $(el).find('a.base-card__full-link').attr('href');
      const logo = $(el).find('img.artdeco-entity-image').attr('data-delayed-url') || "";
      
      // Try multiple selectors for ago time
      let agoTime = $(el).find('span.job-search-card__listdate').text().trim();
      if (!agoTime) {
        agoTime = $(el).find('time').text().trim();
      }
      if (!agoTime) {
        agoTime = $(el).find('.job-search-card__listdate--new').text().trim();
      }
      if (!agoTime) {
        agoTime = $(el).find('[data-tracking-control-name="job-search-card-time"]').text().trim();
      }
      
      const agoTimeInSeconds = parseAgoTime(agoTime);

      jobs.push({ 
        position, 
        company, 
        location, 
        date, 
        salary, 
        jobUrl, 
        companyLogo: logo, 
        agoTime,
        agoTimeInSeconds 
      });
    } catch (err) {
      console.log('Error parsing job:', err.message);
    }
  });

  return jobs;
}

function mapValue(value, mapping) {
  return value ? mapping[value.toLowerCase()] || "" : "";
}

// Enhanced getJobs function with profile-based matching
export const getJobs = async (req, res) => {
  const {
    keyword = "", 
    location = "", 
    dateSincePosted = "", 
    jobType = "", 
    remoteFilter = "",
    salary = "", 
    experienceLevel = "", 
    sortBy = "", 
    limit = 0, 
    page = 0,
    ago = "",
    userProfile = null, // New parameter for user profile
    enableSmartMatch = false // Enable smart matching
  } = req.query;
  const user_id = req.user.id;

  let finalKeyword = keyword;
  let finalExperienceLevel = experienceLevel;
  let finalRemoteFilter = remoteFilter;

  // If user profile is provided and smart matching is enabled
  if (userProfile && enableSmartMatch) {
    try {
      const profile = typeof userProfile === 'string' ? JSON.parse(userProfile) : userProfile;
      const smartKeywords = generateSmartKeywords(profile);
      
      // Use smart keywords if no manual keyword provided
      if (!keyword) {
        finalKeyword = smartKeywords.primaryKeywords;
      }
      
      // Use profile-based experience level if not specified
      if (!experienceLevel) {
        finalExperienceLevel = smartKeywords.experienceLevel;
      }
      
      // Prefer remote if user has remote-friendly skills
      if (!remoteFilter && profile.skills.some(skill => 
        skill.toLowerCase().includes('api') || 
        skill.toLowerCase().includes('web scraping') ||
        skill.toLowerCase().includes('automation')
      )) {
        finalRemoteFilter = "remote";
      }
      
    } catch (error) {
      console.error('Error parsing user profile:', error);
    }
  }

  const dateMap = { "past month": "r2592000", "past week": "r604800", "24hr": "r86400" };
  const expMap = { internship: "1", "entry level": "2", associate: "3", senior: "4", director: "5", executive: "6" };
  const jobMap = { "full time": "F", "part time": "P", contract: "C", temporary: "T", volunteer: "V", internship: "I" };
  const remoteMap = { "on-site": "1", remote: "2", hybrid: "3" };
  const salaryMap = { "40000": "1", "60000": "2", "80000": "3", "100000": "4", "120000": "5" };

  const params = {
    keywords: finalKeyword.replace(/ /g, "+"),
    location: location.replace(/ /g, "+"),
    f_TPR: mapValue(dateSincePosted, dateMap),
    f_SB2: salaryMap[salary] || "",
    f_E: mapValue(finalExperienceLevel, expMap),
    f_WT: mapValue(finalRemoteFilter, remoteMap),
    f_JT: mapValue(jobType, jobMap),
    start: String(page * 25),
    sortBy: sortBy === "recent" ? "DD" : sortBy === "relevant" ? "R" : ""
  };

  const url = buildUrl(params);
  const cacheKey = `${url}_${ago}_${enableSmartMatch}`;
  const cached = cache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp < TTL)) {
    return res.json(cached.data);
  }

  let allJobs = [];
  let start = 0;
  const batchSize = 25;

  try {
    while (true) {
      const paginatedUrl = buildUrl({ ...params, start: String(start) });
      const response = await axios.get(paginatedUrl, {
        headers: {
          "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
          "Accept": "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          "Referer": "https://www.linkedin.com/jobs/collections/recommended",
        },
        timeout: 10000,
      });

      const jobs = parseJobs(response.data);
      if (!jobs.length) break;

      allJobs = allJobs.concat(jobs);
      if (limit && allJobs.length >= limit) {
        allJobs = allJobs.slice(0, limit);
        break;
      }

      start += batchSize;
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 1000));
    }

    // Filter jobs by ago time if specified
    if (ago) {
      allJobs = filterJobsByAgoTime(allJobs, ago);
    }

    // Calculate match scores and sort if user profile provided
    if (userProfile && enableSmartMatch) {
      try {
        const profile = typeof userProfile === 'string' ? JSON.parse(userProfile) : userProfile;
        
        allJobs = allJobs.map(job => ({
          ...job,
          matchScore: calculateJobMatchScore(job, profile)
        }));
        
        // Sort by match score descending
        allJobs.sort((a, b) => b.matchScore - a.matchScore);
        
        // Add match reasons for top jobs
        allJobs = allJobs.map(job => {
          const reasons = [];
          if (job.matchScore > 20) reasons.push("High skill match");
          if (job.matchScore > 15) reasons.push("Preference alignment");
          if (job.location.toLowerCase().includes('remote')) reasons.push("Remote work");
          if (job.agoTimeInSeconds < 86400) reasons.push("Recently posted");
          
          return {
            ...job,
            matchReasons: reasons
          };
        });
        
      } catch (error) {
        console.error('Error calculating match scores:', error);
      }
    }

    if (allJobs.length) {
      cache.set(cacheKey, { data: allJobs, timestamp: now });
    }

    res.json(allJobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs", details: err.message });
  }
}

// Helper function to generate optimized query for user profile
export const generateProfileBasedQuery = (userProfile) => {
  const smartKeywords = generateSmartKeywords(userProfile);
  
  return {
    keyword: smartKeywords.primaryKeywords,
    location: "Pakistan", // Based on your previous query
    remoteFilter: "remote",
    jobType: "full time",
    experienceLevel: smartKeywords.experienceLevel,
    dateSincePosted: "past week",
    limit: 50,
    sortBy: "recent",
    ago: "2d",
    enableSmartMatch: true,
    userProfile: JSON.stringify(userProfile)
  };
};

// Add this new function after the existing functions
export const getPersonalizedJobs = async (req, res) => {
  const {
    location = "Pakistan", // Default to Pakistan as seen in previous queries
    dateSincePosted = "past week", 
    jobType = "full time", 
    remoteFilter = "remote",
    salary = "", 
    sortBy = "recent", 
    limit = 50, 
    page = 0,
    ago = "7d", // Default to 7 days
    useOnlyPreferences = true // New flag to determine if we should only use preferences
  } = req.query;
  
  const user_id = req.user.id;

  try {
    // Fetch user preferences from database
    const userPreferences = await UserPreferences.findOne({ userId: user_id });
    
    if (!userPreferences) {
      return res.status(404).json({ 
        error: "User preferences not found", 
        message: "Please complete your profile setup first" 
      });
    }

    // Generate smart query parameters based on user profile
    const profileBasedQuery = generateProfileBasedQuery({
      preferences: userPreferences.preferences,
      skills: userPreferences.skills,
      summary: userPreferences.summary,
      projects: userPreferences.projects
    });

    // Override with any explicitly provided parameters
    const finalParams = {
      keyword: req.query.keyword || profileBasedQuery.keyword,
      location: req.query.location || location,
      dateSincePosted: req.query.dateSincePosted || dateSincePosted,
      jobType: req.query.jobType || jobType,
      remoteFilter: req.query.remoteFilter || remoteFilter,
      salary: req.query.salary || salary,
      experienceLevel: req.query.experienceLevel || profileBasedQuery.experienceLevel,
      sortBy: req.query.sortBy || sortBy,
      limit: req.query.limit || limit,
      page: req.query.page || page,
      ago: req.query.ago || ago,
      userProfile: JSON.stringify({
        preferences: userPreferences.preferences,
        skills: userPreferences.skills,
        summary: userPreferences.summary,
        projects: userPreferences.projects
      }),
      enableSmartMatch: true
    };

    // Create a new request object for the getJobs function
    const smartReq = {
      ...req,
      query: finalParams
    };

    // Call the existing getJobs function with smart parameters
    return await getJobs(smartReq, res);

  } catch (error) {
    console.error('Error fetching personalized jobs:', error);
    res.status(500).json({ 
      error: "Error fetching personalized jobs", 
      details: error.message 
    });
  }
};

// Add this helper function to get user profile summary for debugging
export const getUserProfileSummary = async (req, res) => {
  const user_id = req.user.id;

  try {
    const userPreferences = await UserPreferences.findOne({ userId: user_id });
    
    if (!userPreferences) {
      return res.status(404).json({ 
        error: "User preferences not found" 
      });
    }

    const smartKeywords = generateSmartKeywords({
      preferences: userPreferences.preferences,
      skills: userPreferences.skills,
      summary: userPreferences.summary
    });

    res.json({
      userProfile: {
        preferences: userPreferences.preferences,
        skills: userPreferences.skills,
        summary: userPreferences.summary,
        skillsCount: userPreferences.skills.length,
        projectsCount: userPreferences.projects?.length || 0
      },
      generatedKeywords: smartKeywords,
      recommendedQuery: generateProfileBasedQuery({
        preferences: userPreferences.preferences,
        skills: userPreferences.skills,
        summary: userPreferences.summary
      })
    });

  } catch (error) {
    console.error('Error fetching user profile summary:', error);
    res.status(500).json({ 
      error: "Error fetching user profile", 
      details: error.message 
    });
  }
};

// Enhance the generateProfileBasedQuery function to handle the preferences object better
export const generateProfileBasedQueryV2 = (userProfile) => {
  const smartKeywords = generateSmartKeywords(userProfile);
  
  // Extract location preference if available
  let preferredLocation = "Pakistan";
  if (userProfile.preferences && typeof userProfile.preferences === 'object') {
    // Check if preferences contain location info
    if (userProfile.preferences.location) {
      preferredLocation = userProfile.preferences.location;
    }
    if (userProfile.preferences.workLocation) {
      preferredLocation = userProfile.preferences.workLocation;
    }
  }

  // Determine if user prefers remote work
  let preferredRemoteFilter = "remote";
  if (userProfile.summary && userProfile.summary.toLowerCase().includes('on-site')) {
    preferredRemoteFilter = "on-site";
  }
  if (userProfile.summary && userProfile.summary.toLowerCase().includes('hybrid')) {
    preferredRemoteFilter = "hybrid";
  }

  return {
    keyword: smartKeywords.primaryKeywords,
    location: preferredLocation,
    remoteFilter: preferredRemoteFilter,
    jobType: "full time",
    experienceLevel: smartKeywords.experienceLevel,
    dateSincePosted: "past week",
    limit: 50,
    sortBy: "recent",
    ago: "3d", // Focus on recent jobs
    enableSmartMatch: true,
    userProfile: JSON.stringify(userProfile)
  };
};
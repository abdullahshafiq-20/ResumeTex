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

// Generic smart keyword generation for any profession
function generateSmartKeywords(userProfile) {
  const { preferences, skills, summary, projects } = userProfile;
  
  // Use preferences as the PRIMARY source of keywords (this should contain job titles/fields)
  let preferenceKeywords = [];
  if (preferences && typeof preferences === 'string') {
    preferenceKeywords = preferences.toLowerCase()
      .split(/[,\s]+/)
      .filter(word => word.length > 2)
      .map(word => word.trim());
  }
  
  // Extract core skills as keywords (generic approach)
  const skillKeywords = skills.map(skill => {
    // Clean up skill names and extract meaningful parts
    return skill.toLowerCase()
      .replace(/[()]/g, '') // Remove parentheses
      .split(/[,\s\-\/]+/) // Split on common separators
      .filter(word => word.length > 2)
      .join(' ');
  }).filter(Boolean);
  
  // Extract keywords from projects if available
  const projectKeywords = projects ? projects.flatMap(project => 
    project.toLowerCase()
      .split(/[,\s\-\/]+/)
      .filter(word => word.length > 3)
  ) : [];
  
  // Determine experience level from summary (generic approach)
  const summaryLower = summary ? summary.toLowerCase() : '';
  let experienceLevel = 'entry level';
  
  // Look for experience indicators
  const experiencePatterns = [
    { pattern: /(\d+)\+?\s*years?/g, multiplier: 1 },
    { pattern: /senior|lead|manager|director|head/g, level: 'senior' },
    { pattern: /junior|entry|intern|graduate|trainee/g, level: 'entry level' },
    { pattern: /associate|mid.?level/g, level: 'associate' }
  ];
  
  let yearsFound = 0;
  experiencePatterns.forEach(({ pattern, multiplier, level }) => {
    if (level) {
      if (pattern.test(summaryLower)) {
        experienceLevel = level;
      }
    } else if (multiplier) {
      const matches = summaryLower.match(pattern);
      if (matches) {
        const years = parseInt(matches[0]);
        if (!isNaN(years)) yearsFound = Math.max(yearsFound, years);
      }
    }
  });
  
  // Set experience level based on years
  if (yearsFound >= 5) experienceLevel = 'senior';
  else if (yearsFound >= 2) experienceLevel = 'associate';
  else if (yearsFound >= 1) experienceLevel = 'entry level';
  
  // Combine and prioritize keywords
  const allKeywords = [
    ...preferenceKeywords, // Highest priority - user's stated preferences
    ...skillKeywords,      // Medium priority - actual skills
    ...projectKeywords     // Lower priority - project-derived keywords
  ].filter(Boolean);
  
  const uniqueKeywords = [...new Set(allKeywords)];
  
  return {
    primaryKeywords: preferenceKeywords.slice(0, 3).join(' ') || uniqueKeywords.slice(0, 3).join(' '),
    secondaryKeywords: preferenceKeywords.slice(3, 6).join(' ') || uniqueKeywords.slice(3, 6).join(' '),
    experienceLevel,
    topSkills: skills.slice(0, 8),
    allKeywords: uniqueKeywords.slice(0, 10)
  };
}

// Generic job match scoring for any profession
function calculateJobMatchScore(job, userProfile) {
  let score = 0;
  const { skills, preferences, summary, projects } = userProfile;
  
  const jobText = `${job.position} ${job.company} ${job.location}`.toLowerCase();
  
  // 1. Score based on preferences match (HIGHEST WEIGHT)
  if (preferences && typeof preferences === 'string') {
    const prefWords = preferences.toLowerCase().split(/[,\s\-\/]+/);
    prefWords.forEach(word => {
      if (word.length > 2) {
        // Exact match gets higher score
        if (jobText.includes(word)) {
          score += 20;
        }
        // Partial match gets lower score
        const partialMatches = jobText.split(' ').filter(jobWord => 
          jobWord.includes(word) || word.includes(jobWord)
        );
        score += partialMatches.length * 10;
      }
    });
  }
  
  // 2. Score based on skills match (MEDIUM WEIGHT)
  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    
    // Clean skill and split into components
    const skillComponents = skillLower
      .replace(/[()]/g, '')
      .split(/[,\s\-\/]+/)
      .filter(component => component.length > 2);
    
    skillComponents.forEach(component => {
      if (jobText.includes(component)) {
        score += 12; // Base score for skill match
        
        // Bonus if skill appears in job title (more relevant)
        if (job.position.toLowerCase().includes(component)) {
          score += 8;
        }
      }
    });
  });
  
  // 3. Score based on projects relevance (LOWER WEIGHT)
  if (projects) {
    projects.forEach(project => {
      const projectWords = project.toLowerCase().split(/[,\s\-\/]+/);
      projectWords.forEach(word => {
        if (word.length > 3 && jobText.includes(word)) {
          score += 8;
        }
      });
    });
  }
  
  // 4. Generic bonus scoring
  const workTypePreferences = summary ? summary.toLowerCase() : '';
  
  // Remote work preference
  if ((workTypePreferences.includes('remote') || preferences?.toLowerCase().includes('remote')) 
      && (jobText.includes('remote') || jobText.includes('work from home'))) {
    score += 10;
  }
  
  // Location preference bonus
  if (preferences && jobText.includes('pakistan') && preferences.toLowerCase().includes('pakistan')) {
    score += 8;
  }
  
  // Industry/company size preferences
  if (preferences) {
    const prefLower = preferences.toLowerCase();
    if (prefLower.includes('startup') && (jobText.includes('startup') || jobText.includes('early'))) {
      score += 6;
    }
    if (prefLower.includes('enterprise') && (jobText.includes('enterprise') || jobText.includes('corporation'))) {
      score += 6;
    }
  }
  
  // 5. Recency bonus (universal)
  if (job.agoTimeInSeconds < 86400) { // Less than 24 hours
    score += 8;
  } else if (job.agoTimeInSeconds < 259200) { // Less than 3 days
    score += 5;
  } else if (job.agoTimeInSeconds < 604800) { // Less than 1 week
    score += 3;
  }
  
  return Math.max(score, 0); // Ensure non-negative score
}

// Generic function to extract job-relevant terms from any field
function extractJobRelevantTerms(text) {
  if (!text) return [];
  
  const stopWords = new Set([
    'and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
  ]);
  
  return text.toLowerCase()
    .split(/[,\s\-\/\(\)]+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .map(word => word.trim());
}

// Generic remote work detection
function detectRemotePreference(userProfile) {
  const { preferences, summary } = userProfile;
  const combinedText = `${preferences || ''} ${summary || ''}`.toLowerCase();
  
  const remoteIndicators = ['remote', 'work from home', 'distributed', 'virtual', 'online'];
  const onsiteIndicators = ['on-site', 'office', 'in-person', 'local'];
  
  if (remoteIndicators.some(indicator => combinedText.includes(indicator))) {
    return 'remote';
  }
  if (onsiteIndicators.some(indicator => combinedText.includes(indicator))) {
    return 'on-site';
  }
  
  return ''; // No preference detected
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
      //console.log('Error parsing job:', err.message);
    }
  });

  return jobs;
}

function mapValue(value, mapping) {
  return value ? mapping[value.toLowerCase()] || "" : "";
}

// Helper function to merge multiple user preference records
function mergeUserPreferences(userProfiles) {
  if (!userProfiles || userProfiles.length === 0) {
    return null;
  }
  
  if (userProfiles.length === 1) {
    return userProfiles[0];
  }
  
  // Sort by most recent first
  const sortedProfiles = userProfiles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
  // Merge all data
  const mergedProfile = {
    userId: sortedProfiles[0].userId,
    _id: sortedProfiles[0]._id,
    
    // Combine preferences (concatenate unique ones)
    preferences: [...new Set(
      sortedProfiles
        .map(p => p.preferences)
        .filter(Boolean)
        .join(', ')
        .split(/[,\s]+/)
        .filter(word => word.length > 2)
    )].join(' '),
    
    // Use the most recent summary
    summary: sortedProfiles[0].summary || '',
    
    // Combine all skills (remove duplicates)
    skills: [...new Set(
      sortedProfiles
        .flatMap(p => p.skills || [])
        .filter(Boolean)
    )],
    
    // Combine all projects (remove duplicates)
    projects: [...new Set(
      sortedProfiles
        .flatMap(p => p.projects || [])
        .filter(Boolean)
    )],
    
    // Keep metadata from most recent
    createdAt: sortedProfiles[sortedProfiles.length - 1].createdAt,
    updatedAt: sortedProfiles[0].updatedAt,
    __v: sortedProfiles[0].__v
  };
  
  return mergedProfile;
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
  } = req.query;
  const user_id = req.user.id;
  
  // Get ALL user preference records and merge them
  let userProfile = null;
  try {
    const userProfiles = await UserPreferences.find({ userId: user_id }).sort({ updatedAt: -1 });
    userProfile = mergeUserPreferences(userProfiles);
    
    //console.log(`Found ${userProfiles.length} profile record(s) for user ${user_id}`);
    if (userProfile) {
      //console.log(`Merged profile contains ${userProfile.skills.length} skills and ${userProfile.projects.length} projects`);
      //console.log('Combined preferences:', userProfile.preferences);
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
  }

  let finalKeyword = keyword;
  let finalExperienceLevel = experienceLevel;
  let finalRemoteFilter = remoteFilter;

  // If merged user profile is found and has data
  if (userProfile && userProfile.skills && userProfile.skills.length > 0) {
    try {
      const smartKeywords = generateSmartKeywords(userProfile);
      
      // Use smart keywords if no manual keyword provided
      if (!keyword) {
        finalKeyword = smartKeywords.primaryKeywords;
      }
      
      // Use profile-based experience level if not specified
      if (!experienceLevel) {
        finalExperienceLevel = smartKeywords.experienceLevel;
      }
      
      // Prefer remote if user has remote-friendly skills
      if (!remoteFilter && userProfile.skills && userProfile.skills.some(skill => 
        skill.toLowerCase().includes('api') || 
        skill.toLowerCase().includes('web scraping') ||
        skill.toLowerCase().includes('automation')
      )) {
        finalRemoteFilter = "remote";
      }
      
    } catch (error) {
      console.error('Error processing merged user profile:', error);
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
  const cacheKey = `${url}_${ago}`;
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

    // Calculate match scores using merged profile
    if (userProfile && userProfile.skills.length > 0) {
      try {
        allJobs = allJobs.map(job => ({
          ...job,
          matchScore: calculateJobMatchScore(job, userProfile)
        }));
        
        // Sort by match score descending
        allJobs.sort((a, b) => b.matchScore - a.matchScore);
        
        // Add match reasons for top jobs
        allJobs = allJobs.map(job => {
          const reasons = [];
          if (job.matchScore > 30) reasons.push("High skill match");
          if (job.matchScore > 20) reasons.push("Preference alignment");
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
};

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
    userProfile: JSON.stringify(userProfile)
  };
};

// Update getPersonalizedJobs to use merged profiles
export const getPersonalizedJobs = async (req, res) => {
  const {
    location = "Pakistan", 
    dateSincePosted = "past week", 
    jobType = "full time", 
    remoteFilter = "remote",
    salary = "", 
    sortBy = "recent", 
    limit = 50, 
    page = 0,
    ago = "7d",
    useOnlyPreferences = true
  } = req.query;
  
  const user_id = req.user.id;

  try {
    // Get ALL user preference records and merge them
    const userProfiles = await UserPreferences.find({ userId: user_id }).sort({ updatedAt: -1 });
    const mergedProfile = mergeUserPreferences(userProfiles);
    
    if (!mergedProfile) {
      return res.status(404).json({ 
        error: "User preferences not found", 
        message: "Please complete your profile setup first" 
      });
    }

    //console.log(`Merged ${userProfiles.length} profile record(s) for personalized jobs`);

    // Validate that the merged profile has required data
    if (!mergedProfile.skills || mergedProfile.skills.length === 0) {
      return res.status(400).json({ 
        error: "Incomplete user profile", 
        message: "Please add skills to your profile for personalized job matching" 
      });
    }

    // Generate smart query parameters based on merged profile
    const profileBasedQuery = generateProfileBasedQuery(mergedProfile);

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
      userProfile: JSON.stringify(mergedProfile),
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

// Update getUserProfileSummary to show merged data
export const getUserProfileSummary = async (req, res) => {
  const user_id = req.user.id;

  try {
    // Get ALL user preference records
    const userProfiles = await UserPreferences.find({ userId: user_id }).sort({ updatedAt: -1 });
    const mergedProfile = mergeUserPreferences(userProfiles);
    
    if (!mergedProfile) {
      return res.status(404).json({ 
        error: "User preferences not found" 
      });
    }

    const smartKeywords = generateSmartKeywords(mergedProfile);

    res.json({
      totalProfileRecords: userProfiles.length,
      individualRecords: userProfiles.map(profile => ({
        id: profile._id,
        preferences: profile.preferences,
        skillsCount: (profile.skills || []).length,
        projectsCount: (profile.projects || []).length,
        updatedAt: profile.updatedAt
      })),
      mergedProfile: {
        preferences: mergedProfile.preferences,
        skills: mergedProfile.skills,
        summary: mergedProfile.summary,
        projects: mergedProfile.projects,
        totalSkills: mergedProfile.skills.length,
        totalProjects: mergedProfile.projects.length
      },
      generatedKeywords: smartKeywords,
      recommendedQuery: generateProfileBasedQuery(mergedProfile)
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
    userProfile: JSON.stringify(userProfile)
  };
};

// New function to search jobs for each preference separately
export const getJobsByEachPreference = async (req, res) => {
  const {
    location = "Pakistan", 
    dateSincePosted = "past week", 
    jobType = "full time", 
    remoteFilter = "remote",
    salary = "", 
    experienceLevel = "",
    sortBy = "recent", 
    limit = 10,  // Default 10 per preference
    page = 0,
    ago = "7d"
  } = req.query;
  
  const user_id = req.user.id;

  try {
    // Get ALL user preference records
    const userProfiles = await UserPreferences.find({ userId: user_id }).sort({ updatedAt: -1 });
    
    if (!userProfiles || userProfiles.length === 0) {
      return res.status(404).json({ 
        error: "User preferences not found", 
        message: "Please complete your profile setup first" 
      });
    }

    //console.log(`Found ${userProfiles.length} preference record(s) for user ${user_id}`);

    const dateMap = { "past month": "r2592000", "past week": "r604800", "24hr": "r86400" };
    const expMap = { internship: "1", "entry level": "2", associate: "3", senior: "4", director: "5", executive: "6" };
    const jobMap = { "full time": "F", "part time": "P", contract: "C", temporary: "T", volunteer: "V", internship: "I" };
    const remoteMap = { "on-site": "1", remote: "2", hybrid: "3" };
    const salaryMap = { "40000": "1", "60000": "2", "80000": "3", "100000": "4", "120000": "5" };

    const results = [];

    // Search jobs for each preference separately
    for (let i = 0; i < userProfiles.length; i++) {
      const profile = userProfiles[i];
      const preferenceTitle = profile.preferences || `Preference ${i + 1}`;
      
      //console.log(`Searching jobs for preference: "${preferenceTitle}"`);

      try {
        // Build search parameters for this specific preference
        const params = {
          keywords: preferenceTitle.replace(/ /g, "+"),
          location: location.replace(/ /g, "+"),
          f_TPR: mapValue(dateSincePosted, dateMap),
          f_SB2: salaryMap[salary] || "",
          f_E: mapValue(experienceLevel, expMap),
          f_WT: mapValue(remoteFilter, remoteMap),
          f_JT: mapValue(jobType, jobMap),
          start: String(page * 25),
          sortBy: sortBy === "recent" ? "DD" : sortBy === "relevant" ? "R" : ""
        };

        let jobsForThisPreference = [];
        let start = 0;
        const batchSize = 25;
        const targetLimit = parseInt(limit);

        // Search until we get enough jobs for this preference
        while (jobsForThisPreference.length < targetLimit) {
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

          jobsForThisPreference = jobsForThisPreference.concat(jobs);
          start += batchSize;

          // Add delay between requests to avoid rate limiting
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
        }

        // Filter by ago time if specified
        if (ago) {
          jobsForThisPreference = filterJobsByAgoTime(jobsForThisPreference, ago);
        }

        // Limit to requested number
        jobsForThisPreference = jobsForThisPreference.slice(0, targetLimit);

        // Calculate match scores for this preference
        jobsForThisPreference = jobsForThisPreference.map(job => ({
          ...job,
          matchScore: calculateJobMatchScore(job, profile),
          preferenceUsed: preferenceTitle
        }));

        // Sort by match score
        jobsForThisPreference.sort((a, b) => b.matchScore - a.matchScore);

        // Add to results
        results.push({
          preference: preferenceTitle,
          profileId: profile._id,
          skillsCount: (profile.skills || []).length,
          projectsCount: (profile.projects || []).length,
          updatedAt: profile.updatedAt,
          jobsFound: jobsForThisPreference.length,
          jobs: jobsForThisPreference
        });

        //console.log(`Found ${jobsForThisPreference.length} jobs for "${preferenceTitle}"`);

      } catch (error) {
        console.error(`Error searching jobs for preference "${preferenceTitle}":`, error.message);
        
        // Add empty result for this preference
        results.push({
          preference: preferenceTitle,
          profileId: profile._id,
          error: error.message,
          jobsFound: 0,
          jobs: []
        });
      }
    }

    // Summary statistics
    const totalJobs = results.reduce((sum, result) => sum + result.jobsFound, 0);
    
    res.json({
      summary: {
        totalPreferences: userProfiles.length,
        totalJobsFound: totalJobs,
        averageJobsPerPreference: Math.round(totalJobs / userProfiles.length),
        searchParameters: {
          location,
          dateSincePosted,
          jobType,
          remoteFilter,
          limit: parseInt(limit),
          ago
        }
      },
      results
    });

  } catch (error) {
    console.error('Error in getJobsByEachPreference:', error);
    res.status(500).json({ 
      error: "Error fetching jobs by preferences", 
      details: error.message 
    });
  }
};

// Enhanced version that also considers skills for each preference
export const getJobsByEachPreferenceWithSkills = async (req, res) => {
  const {
    location = "Pakistan", 
    dateSincePosted = "past week", 
    jobType = "full time", 
    remoteFilter = "remote",
    salary = "", 
    experienceLevel = "",
    sortBy = "recent", 
    limit = 10,
    page = 0,
    ago = "7d",
    includeSkills = true  // Option to include skills in search
  } = req.query;
  
  const user_id = req.user.id;

  try {
    const userProfiles = await UserPreferences.find({ userId: user_id }).sort({ updatedAt: -1 });
    
    if (!userProfiles || userProfiles.length === 0) {
      return res.status(404).json({ 
        error: "User preferences not found", 
        message: "Please complete your profile setup first" 
      });
    }

    const results = [];
    const dateMap = { "past month": "r2592000", "past week": "r604800", "24hr": "r86400" };
    const expMap = { internship: "1", "entry level": "2", associate: "3", senior: "4", director: "5", executive: "6" };
    const jobMap = { "full time": "F", "part time": "P", contract: "C", temporary: "T", volunteer: "V", internship: "I" };
    const remoteMap = { "on-site": "1", remote: "2", hybrid: "3" };
    const salaryMap = { "40000": "1", "60000": "2", "80000": "3", "100000": "4", "120000": "5" };

    for (let i = 0; i < userProfiles.length; i++) {
      const profile = userProfiles[i];
      const preferenceTitle = profile.preferences || `Preference ${i + 1}`;
      
      // Create enhanced search keywords by combining preference with top skills
      let searchKeywords = preferenceTitle;
      if (includeSkills === 'true' && profile.skills && profile.skills.length > 0) {
        const topSkills = profile.skills.slice(0, 3).join(' ');
        searchKeywords = `${preferenceTitle} ${topSkills}`;
      }

      //console.log(`Searching jobs for: "${searchKeywords}"`);

      try {
        const params = {
          keywords: searchKeywords.replace(/ /g, "+"),
          location: location.replace(/ /g, "+"),
          f_TPR: mapValue(dateSincePosted, dateMap),
          f_SB2: salaryMap[salary] || "",
          f_E: mapValue(experienceLevel, expMap),
          f_WT: mapValue(remoteFilter, remoteMap),
          f_JT: mapValue(jobType, jobMap),
          start: String(page * 25),
          sortBy: sortBy === "recent" ? "DD" : sortBy === "relevant" ? "R" : ""
        };

        let jobsForThisPreference = [];
        let start = 0;
        const batchSize = 25;
        const targetLimit = parseInt(limit);

        while (jobsForThisPreference.length < targetLimit) {
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

          jobsForThisPreference = jobsForThisPreference.concat(jobs);
          start += batchSize;
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
        }

        if (ago) {
          jobsForThisPreference = filterJobsByAgoTime(jobsForThisPreference, ago);
        }

        jobsForThisPreference = jobsForThisPreference.slice(0, targetLimit);

        jobsForThisPreference = jobsForThisPreference.map(job => ({
          ...job,
          matchScore: calculateJobMatchScore(job, profile),
          searchKeywords: searchKeywords,
          preferenceUsed: preferenceTitle
        }));

        jobsForThisPreference.sort((a, b) => b.matchScore - a.matchScore);

        results.push({
          preference: preferenceTitle,
          searchKeywords: searchKeywords,
          profileId: profile._id,
          skills: profile.skills || [],
          skillsUsed: includeSkills === 'true' ? profile.skills.slice(0, 3) : [],
          jobsFound: jobsForThisPreference.length,
          jobs: jobsForThisPreference
        });

      } catch (error) {
        console.error(`Error searching for "${preferenceTitle}":`, error.message);
        results.push({
          preference: preferenceTitle,
          searchKeywords: searchKeywords,
          profileId: profile._id,
          error: error.message,
          jobsFound: 0,
          jobs: []
        });
      }
    }

    const totalJobs = results.reduce((sum, result) => sum + result.jobsFound, 0);
    
    res.json({
      summary: {
        totalPreferences: userProfiles.length,
        totalJobsFound: totalJobs,
        limitPerPreference: parseInt(limit),
        includeSkills: includeSkills === 'true'
      },
      results
    });

  } catch (error) {
    console.error('Error in enhanced preference search:', error);
    res.status(500).json({ 
      error: "Error fetching jobs by preferences with skills", 
      details: error.message 
    });
  }
};

// Modified function to show all jobs combined and sorted by score
export const getJobsByAllPreferencesSorted = async (req, res) => {
  const {
    location = "Pakistan", 
    dateSincePosted = "past week", 
    jobType = "full time", 
    remoteFilter = "remote",
    salary = "", 
    experienceLevel = "",
    sortBy = "recent", 
    limit = 10,  // Total limit across all preferences
    limitPerPreference = 20, // How many to fetch per preference before combining
    page = 0,
    ago = "7d",
    includeSkills = true
  } = req.query;
  
  const user_id = req.user.id;

  try {
    const userProfiles = await UserPreferences.find({ userId: user_id }).sort({ updatedAt: -1 });
    
    if (!userProfiles || userProfiles.length === 0) {
      return res.status(404).json({ 
        error: "User preferences not found", 
        message: "Please complete your profile setup first" 
      });
    }

    //console.log(`Found ${userProfiles.length} preference record(s) for user ${user_id}`);

    const dateMap = { "past month": "r2592000", "past week": "r604800", "24hr": "r86400" };
    const expMap = { internship: "1", "entry level": "2", associate: "3", senior: "4", director: "5", executive: "6" };
    const jobMap = { "full time": "F", "part time": "P", contract: "C", temporary: "T", volunteer: "V", internship: "I" };
    const remoteMap = { "on-site": "1", remote: "2", hybrid: "3" };
    const salaryMap = { "40000": "1", "60000": "2", "80000": "3", "100000": "4", "120000": "5" };

    let allJobs = [];
    const preferenceResults = [];

    // Search jobs for each preference
    for (let i = 0; i < userProfiles.length; i++) {
      const profile = userProfiles[i];
      const preferenceTitle = profile.preferences || `Preference ${i + 1}`;
      
      // Create search keywords
      let searchKeywords = preferenceTitle;
      if (includeSkills === 'true' && profile.skills && profile.skills.length > 0) {
        const topSkills = profile.skills.slice(0, 3).join(' ');
        searchKeywords = `${preferenceTitle} ${topSkills}`;
      }

      //console.log(`Searching jobs for: "${searchKeywords}"`);

      try {
        const params = {
          keywords: searchKeywords.replace(/ /g, "+"),
          location: location.replace(/ /g, "+"),
          f_TPR: mapValue(dateSincePosted, dateMap),
          f_SB2: salaryMap[salary] || "",
          f_E: mapValue(experienceLevel, expMap),
          f_WT: mapValue(remoteFilter, remoteMap),
          f_JT: mapValue(jobType, jobMap),
          start: String(page * 25),
          sortBy: sortBy === "recent" ? "DD" : sortBy === "relevant" ? "R" : ""
        };

        let jobsForThisPreference = [];
        let start = 0;
        const batchSize = 25;
        const targetLimit = parseInt(limitPerPreference);

        // Search until we get enough jobs for this preference
        while (jobsForThisPreference.length < targetLimit) {
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

          jobsForThisPreference = jobsForThisPreference.concat(jobs);
          start += batchSize;

          // Add delay between requests
          await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
        }

        // Filter by ago time if specified
        if (ago) {
          jobsForThisPreference = filterJobsByAgoTime(jobsForThisPreference, ago);
        }

        // Limit to requested number per preference
        jobsForThisPreference = jobsForThisPreference.slice(0, targetLimit);

        // Calculate match scores and add metadata
        const processedJobs = jobsForThisPreference.map(job => ({
          ...job,
          matchScore: calculateJobMatchScore(job, profile),
          preferenceUsed: preferenceTitle,
          searchKeywords: searchKeywords,
          profileId: profile._id.toString(),
          skillsFromProfile: profile.skills || [],
          // Add unique identifier to avoid duplicates
          uniqueId: `${job.jobUrl || job.position}-${job.company}`.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
        }));

        // Add to all jobs array
        allJobs = allJobs.concat(processedJobs);

        // Store preference result for summary
        preferenceResults.push({
          preference: preferenceTitle,
          searchKeywords: searchKeywords,
          jobsFound: processedJobs.length,
          averageScore: processedJobs.length > 0 ? 
            Math.round(processedJobs.reduce((sum, job) => sum + job.matchScore, 0) / processedJobs.length) : 0
        });

        //console.log(`Found ${processedJobs.length} jobs for "${preferenceTitle}"`);

      } catch (error) {
        console.error(`Error searching for "${preferenceTitle}":`, error.message);
        preferenceResults.push({
          preference: preferenceTitle,
          searchKeywords: searchKeywords,
          error: error.message,
          jobsFound: 0,
          averageScore: 0
        });
      }
    }

    // Remove duplicates based on uniqueId
    const uniqueJobs = [];
    const seenIds = new Set();
    
    allJobs.forEach(job => {
      if (!seenIds.has(job.uniqueId)) {
        seenIds.add(job.uniqueId);
        uniqueJobs.push(job);
      }
    });

    //console.log(`Total jobs before deduplication: ${allJobs.length}`);
    //console.log(`Unique jobs after deduplication: ${uniqueJobs.length}`);

    // Sort ALL jobs by match score (highest first)
    uniqueJobs.sort((a, b) => b.matchScore - a.matchScore);

    // Apply final limit
    const finalLimit = parseInt(limit);
    const limitedJobs = uniqueJobs.slice(0, finalLimit);

    // Add match reasons for top jobs
    const jobsWithReasons = limitedJobs.map((job, index) => {
      const reasons = [];
      
      if (job.matchScore > 40) reasons.push("Excellent match");
      else if (job.matchScore > 25) reasons.push("Good match");
      else if (job.matchScore > 15) reasons.push("Fair match");
      
      if (job.agoTimeInSeconds < 86400) reasons.push("Posted recently");
      if (job.location.toLowerCase().includes('remote')) reasons.push("Remote work");
      if (job.position.toLowerCase().includes(job.preferenceUsed.toLowerCase().split(' ')[0])) {
        reasons.push("Title matches preference");
      }
      
      return {
        ...job,
        rank: index + 1,
        matchReasons: reasons,
        // Remove uniqueId from final response
        uniqueId: undefined
      };
    });

    // Calculate statistics
    const scoreRanges = {
      excellent: jobsWithReasons.filter(job => job.matchScore > 40).length,
      good: jobsWithReasons.filter(job => job.matchScore > 25 && job.matchScore <= 40).length,
      fair: jobsWithReasons.filter(job => job.matchScore > 15 && job.matchScore <= 25).length,
      poor: jobsWithReasons.filter(job => job.matchScore <= 15).length
    };

    const preferenceDistribution = {};
    jobsWithReasons.forEach(job => {
      preferenceDistribution[job.preferenceUsed] = (preferenceDistribution[job.preferenceUsed] || 0) + 1;
    });

    res.json({
      summary: {
        totalPreferencesSearched: userProfiles.length,
        totalJobsFound: uniqueJobs.length,
        jobsAfterDeduplication: uniqueJobs.length,
        jobsReturned: jobsWithReasons.length,
        requestedLimit: finalLimit,
        limitPerPreference: parseInt(limitPerPreference),
        averageScore: jobsWithReasons.length > 0 ? 
          Math.round(jobsWithReasons.reduce((sum, job) => sum + job.matchScore, 0) / jobsWithReasons.length) : 0,
        highestScore: jobsWithReasons.length > 0 ? jobsWithReasons[0].matchScore : 0,
        lowestScore: jobsWithReasons.length > 0 ? jobsWithReasons[jobsWithReasons.length - 1].matchScore : 0
      },
      scoreDistribution: scoreRanges,
      preferenceDistribution: preferenceDistribution,
      preferenceResults: preferenceResults,
      jobs: jobsWithReasons
    });

  } catch (error) {
    console.error('Error in getJobsByAllPreferencesSorted:', error);
    res.status(500).json({ 
      error: "Error fetching and sorting jobs by all preferences", 
      details: error.message 
    });
  }
};

// Also create a simpler version for just getting top jobs
export const getTopJobsAcrossPreferences = async (req, res) => {
  const {
    limit = 25,
    location = "Pakistan",
    remoteFilter = "remote",
    ago = "7d"
  } = req.query;

  // Set parameters to get more jobs per preference for better sorting
  const enhancedQuery = {
    ...req.query,
    limit: parseInt(limit),
    limitPerPreference: Math.max(parseInt(limit) * 2, 50), // Get more per preference
    includeSkills: 'true'
  };

  // Create new request object
  const enhancedReq = {
    ...req,
    query: enhancedQuery
  };

  // Call the full function
  return await getJobsByAllPreferencesSorted(enhancedReq, res);
};
import axios from "axios";
import * as cheerio from 'cheerio';

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
  
  // Handle different formats: "2 days ago", "1 hour ago", "30 minutes ago", etc.
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

// Filter jobs based on ago time
function filterJobsByAgoTime(jobs, agoFilter) {
  if (!agoFilter) return jobs;
  
  const maxAgeInSeconds = convertTimeToSeconds(agoFilter);
  if (maxAgeInSeconds === 0) return jobs;
  
  return jobs.filter(job => {
    return job.agoTimeInSeconds <= maxAgeInSeconds;
  });
}

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
    ago = "" // New parameter for time-based filtering
  } = req.query;

  const dateMap = { "past month": "r2592000", "past week": "r604800", "24hr": "r86400" };
  const expMap = { internship: "1", "entry level": "2", associate: "3", senior: "4", director: "5", executive: "6" };
  const jobMap = { "full time": "F", "part time": "P", contract: "C", temporary: "T", volunteer: "V", internship: "I" };
  const remoteMap = { "on-site": "1", remote: "2", hybrid: "3" };
  const salaryMap = { "40000": "1", "60000": "2", "80000": "3", "100000": "4", "120000": "5" };

  const params = {
    keywords: keyword.replace(/ /g, "+"),
    location: location.replace(/ /g, "+"),
    f_TPR: mapValue(dateSincePosted, dateMap),
    f_SB2: salaryMap[salary] || "",
    f_E: mapValue(experienceLevel, expMap),
    f_WT: mapValue(remoteFilter, remoteMap),
    f_JT: mapValue(jobType, jobMap),
    start: String(page * 25),
    sortBy: sortBy === "recent" ? "DD" : sortBy === "relevant" ? "R" : ""
  };

  const url = buildUrl(params);
  const cacheKey = `${url}_${ago}`; // Include ago in cache key
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
          "Referer": "https://www.linkedin.com/jobs",
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

    if (allJobs.length) {
      cache.set(cacheKey, { data: allJobs, timestamp: now });
    }

    res.json(allJobs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching jobs", details: err.message });
  }
}
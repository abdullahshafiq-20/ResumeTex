import express from "express";
import { getJobs } from "../controllers/jobs/jobsController.js";
import { 
  getPersonalizedJobs, 
  getUserProfileSummary,
  getJobs as getSmartJobs,
  getJobsByEachPreference,
  getJobsByEachPreferenceWithSkills,
  getJobsByAllPreferencesSorted,
  getTopJobsAcrossPreferences
} from "../controllers/jobs/smartSystem.js";
import { verifyToken } from "../middleware/auth.js";

const jobRoutes = express.Router();

// Original basic job search
jobRoutes.get("/jobs", getJobs);

// New personalized job search using user preferences
jobRoutes.get("/personalized-jobs", verifyToken, getPersonalizedJobs);

// Smart job search with manual parameters but smart matching
jobRoutes.get("/smart-jobs", verifyToken, getSmartJobs);

// Search jobs for each preference separately
jobRoutes.get("/jobs-by-preferences", verifyToken, getJobsByEachPreference);

// Enhanced version with skills included
jobRoutes.get("/jobs-by-preferences-enhanced", verifyToken, getJobsByEachPreferenceWithSkills);

// All jobs from all preferences sorted by match score
jobRoutes.get("/jobs-all-preferences-sorted", verifyToken, getJobsByAllPreferencesSorted);

// Simplified version for getting top jobs
jobRoutes.get("/top-jobs", verifyToken, getTopJobsAcrossPreferences);

// Get user profile summary for debugging/preview
jobRoutes.get("/profile-summary", verifyToken, getUserProfileSummary);

export default jobRoutes;
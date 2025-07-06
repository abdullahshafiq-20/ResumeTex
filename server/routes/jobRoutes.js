import express from "express";
import { getJobs } from "../controllers/jobs/jobsController.js";
import { 
  getPersonalizedJobs, 
  getUserProfileSummary,
  getJobs as getSmartJobs 
} from "../controllers/jobs/smartSystem.js";
import { verifyToken } from "../middleware/auth.js";

const jobRoutes = express.Router();

// Original basic job search
jobRoutes.get("/jobs", getJobs);

// New personalized job search using user preferences
jobRoutes.get("/personalized-jobs", verifyToken, getPersonalizedJobs);

// Smart job search with manual parameters but smart matching
jobRoutes.get("/smart-jobs", verifyToken, getSmartJobs);

// Get user profile summary for debugging/preview
jobRoutes.get("/profile-summary", verifyToken, getUserProfileSummary);

export default jobRoutes;
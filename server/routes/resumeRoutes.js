
import express from "express";
import { onboardResume, getUserResume } from "../controllers/resume/onboardResume.js";
import { verifyToken } from "../middleware/auth.js";


const resumeRoutes = express.Router();

resumeRoutes.get("/onboard-resume", onboardResume);
resumeRoutes.get("/resume/:userId", verifyToken, getUserResume);

export default resumeRoutes;
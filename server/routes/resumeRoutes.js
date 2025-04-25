
import express from "express";
import { onboardResume } from "../controllers/resume/onboardResume.js";


const resumeRoutes = express.Router();

resumeRoutes.get("/onboard-resume", onboardResume);

export default resumeRoutes;

import express from "express";
import { onboardResume, getUserResume, convertPdfToImage, addResume, deleteResume } from "../controllers/resume/onboardResume.js";
import { verifyToken } from "../middleware/auth.js";
import { extractData } from "../controllers/extractPdfData.js";
import { manualResumeController } from "../controllers/resume/manualResumeController.js";
const resumeRoutes = express.Router();

resumeRoutes.get("/onboard-resume", verifyToken, onboardResume);
resumeRoutes.get("/resume/:userId", verifyToken, getUserResume);
resumeRoutes.get("/pdf-to-img", convertPdfToImage);
resumeRoutes.post("/addresume", verifyToken, addResume);
resumeRoutes.post("/extract-data", extractData);
resumeRoutes.post("/delete-resume", verifyToken, deleteResume);
resumeRoutes.post("/manual-resume", verifyToken, manualResumeController);

export default resumeRoutes;
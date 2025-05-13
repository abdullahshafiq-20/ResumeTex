
import express from "express";
import { onboardResume, getUserResume, convertPdfToImage, addResume } from "../controllers/resume/onboardResume.js";
import { verifyToken } from "../middleware/auth.js";


const resumeRoutes = express.Router();

resumeRoutes.get("/onboard-resume", onboardResume);
resumeRoutes.get("/resume/:userId", verifyToken, getUserResume);
resumeRoutes.get("/pdf-to-img", convertPdfToImage);
resumeRoutes.post("/addresume", verifyToken, addResume);

export default resumeRoutes;
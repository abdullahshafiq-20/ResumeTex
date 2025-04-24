import express from "express";
import { googleAuth, googleCallback } from "../controllers/googleOAuth/googleAuthController.js";

const authRoutes = express.Router();

authRoutes.get("/auth/google", googleAuth);
authRoutes.get("/auth/google/callback", googleCallback);

export default authRoutes;
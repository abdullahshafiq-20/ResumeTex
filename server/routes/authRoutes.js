import express from "express";
import { googleAuth, googleCallback } from "../controllers/googleOAuth/googleAuthController.js";
import { verifyToken } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.get("/auth/google", googleAuth);
authRoutes.get("/auth/google/callback", googleCallback);
authRoutes.get("/auth/user", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});

export default authRoutes;
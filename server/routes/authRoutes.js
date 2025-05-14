import express from "express";
import { googleAuth, googleCallback, getUserProfile, validateUser, validateUserSecret, getConnectionStatus } from "../controllers/googleOAuth/googleAuthController.js";
import { verifyToken } from "../middleware/auth.js";

const authRoutes = express.Router();

authRoutes.get("/auth/google", googleAuth);
authRoutes.get("/auth/google/callback", googleCallback);
authRoutes.get("/auth/user", verifyToken, (req, res) => {
  res.status(200).json({ user: req.user });
});
authRoutes.get("/user", verifyToken, getUserProfile);
authRoutes.post("/validate", validateUser);
authRoutes.post("/validateSecret", validateUserSecret);
authRoutes.get("/connectionStatus", verifyToken, getConnectionStatus);



export default authRoutes;
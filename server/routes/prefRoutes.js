import express from "express";
import { updateUserPreferences } from "../controllers/Prefrences/prefrencesController.js";
import { verifyToken } from "../middleware/auth.js";


const prefRouter = express.Router();
prefRouter.post("/update-pref", verifyToken, updateUserPreferences);

export default prefRouter;
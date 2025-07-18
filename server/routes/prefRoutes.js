import express from "express";
import { updateUserPreferences, addLinks } from "../controllers/Prefrences/prefrencesController.js";
import { verifyToken } from "../middleware/auth.js";


const prefRouter = express.Router();
prefRouter.post("/update-pref", verifyToken, updateUserPreferences);
prefRouter.post("/add-links", verifyToken, addLinks);

export default prefRouter;
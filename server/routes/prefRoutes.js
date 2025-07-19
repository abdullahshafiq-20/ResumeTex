import express from "express";
import { updateUserPreferences, addLinks, updateLinks, deleteLink } from "../controllers/Prefrences/prefrencesController.js";
import { verifyToken } from "../middleware/auth.js";


const prefRouter = express.Router();
prefRouter.post("/update-pref", verifyToken, updateUserPreferences);
prefRouter.post("/add-links", verifyToken, addLinks);
prefRouter.post("/update-links", verifyToken, updateLinks);
prefRouter.post("/delete-link", verifyToken, deleteLink);

export default prefRouter;
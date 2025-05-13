import express from "express";
import { savePost, createSecret, getPosts } from "../controllers/Extension/extensionController.js";
import { verifyToken } from "../middleware/auth.js";

const extensionRoutes = express.Router();

extensionRoutes.post("/extension/savePost", savePost);
extensionRoutes.post("/extension/createSecret", verifyToken ,createSecret);
extensionRoutes.get("/getPosts", verifyToken ,getPosts);



export default extensionRoutes;

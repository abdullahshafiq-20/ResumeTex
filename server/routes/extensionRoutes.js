import express from "express";
import { savePost, createSecret, getPosts, deletePost } from "../controllers/Extension/extensionController.js";
import { getLinkedInPost, clearPostCache, getCacheStats } from "../controllers/Extension/postController.js";
import { verifyToken } from "../middleware/auth.js";

const extensionRoutes = express.Router();

extensionRoutes.post("/extension/savePost", verifyToken, savePost);
extensionRoutes.post("/extension/createSecret", verifyToken ,createSecret);
extensionRoutes.get("/getPosts", verifyToken ,getPosts);
extensionRoutes.delete("/deletePost/:postId", verifyToken ,deletePost);
extensionRoutes.get("/getLinkedInPost" ,getLinkedInPost);
extensionRoutes.get("/clearPostCache", verifyToken ,clearPostCache);
extensionRoutes.get("/getCacheStats", verifyToken ,getCacheStats);




export default extensionRoutes;

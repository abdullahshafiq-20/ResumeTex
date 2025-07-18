import express from "express";
import { savePost, createSecret, getPosts, deletePost, makeMatchFound } from "../controllers/Extension/extensionController.js";
import { getLinkedInPost, clearPostCache, getCacheStats } from "../controllers/Extension/postController.js";
import { verifyToken } from "../middleware/auth.js";
import { coinGate } from "../middleware/coinMiddleware.js";

const extensionRoutes = express.Router();

extensionRoutes.post("/extension/savePost", verifyToken, coinGate('scrapedPost'), savePost);
extensionRoutes.post("/extension/createSecret", verifyToken ,createSecret);
extensionRoutes.get("/getPosts", verifyToken ,getPosts);
extensionRoutes.delete("/deletePost/:postId", verifyToken ,deletePost);
extensionRoutes.get("/getLinkedInPost" ,getLinkedInPost);
extensionRoutes.get("/clearPostCache", verifyToken ,clearPostCache);
extensionRoutes.get("/getCacheStats", verifyToken ,getCacheStats);
extensionRoutes.post("/makeMatchFound/:postId", verifyToken ,makeMatchFound);





export default extensionRoutes;

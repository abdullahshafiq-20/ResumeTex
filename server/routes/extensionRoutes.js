import express from "express";
import { savePost, createSecret, getPosts, deletePost } from "../controllers/Extension/extensionController.js";
import { verifyToken } from "../middleware/auth.js";

const extensionRoutes = express.Router();

extensionRoutes.post("/extension/savePost", savePost);
extensionRoutes.post("/extension/createSecret", verifyToken ,createSecret);
extensionRoutes.get("/getPosts", verifyToken ,getPosts);
extensionRoutes.delete("/deletePost/:postId", verifyToken ,deletePost);




export default extensionRoutes;

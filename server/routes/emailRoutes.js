import express from "express";
import { sendEmail, sendEmailWithAttachment } from "../controllers/email/emailController.js";
import { verifyToken } from "../middleware/auth.js";

const emailRoutes = express.Router();

emailRoutes.post("/send-email", verifyToken, sendEmail);
emailRoutes.post("/send-email-with-attachment", verifyToken, sendEmailWithAttachment);

export default emailRoutes;


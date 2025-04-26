import express from "express";
import { sendEmail, sendEmailWithAttachment, createEmail, saveEmail, updateEmail } from "../controllers/email/emailController.js";
import { verifyToken } from "../middleware/auth.js";

const emailRoutes = express.Router();

emailRoutes.post("/send-email", verifyToken, sendEmail);
emailRoutes.post("/send-email-with-attachment", verifyToken, sendEmailWithAttachment);
emailRoutes.post("/create-email", verifyToken, createEmail);
emailRoutes.post("/save-email", verifyToken, saveEmail);
emailRoutes.post("/update-email/:emailId", verifyToken, updateEmail);

export default emailRoutes;


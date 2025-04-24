// emailController.js
import { google } from "googleapis";
import dotenv from "dotenv";
import { User } from "../models/userSchema.js";
import { setupOAuthWithRefreshToken } from "../utils/oauthUtils.js";
dotenv.config();

// Controller to send email
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware
    
    // Get user from database with tokens
    const user = await User.findById(userId);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    
    // Set up OAuth2 client with user's refresh token
    const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);
    
    // Create Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Encode email content
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${user.email}`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      message
    ];
    const emailContent = messageParts.join('\n');
    
    // Encode the email to base64url format
    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    
    return res.status(200).json({ success: true, messageId: result.data.id });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};

// Send an email with attachments
export const sendEmailWithAttachment = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const attachment = req.file; // Assuming you're using multer for file uploads
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    
    // Set up OAuth2 client with user's refresh token
    const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);
    
    // Create Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Read file if there is an attachment
    let attachmentPart = '';
    if (attachment) {
      const attachmentBase64 = attachment.buffer.toString('base64');
      const boundary = 'foo_bar_baz';
      
      attachmentPart = `
--${boundary}
Content-Type: ${attachment.mimetype}
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${attachment.originalname}"

${attachmentBase64}
--${boundary}--`;
      
      // Start with multipart message
      const messageParts = [
        `From: ${user.email}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        message,
        attachmentPart
      ];
      
      const emailContent = messageParts.join('\n');
      
      // Encode the email to base64url format
      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Send the email
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });
      
      return res.status(200).json({ success: true, messageId: result.data.id });
    } else {
      // Regular email without attachment
      return await sendEmail(req, res);
    }
  } catch (error) {
    console.error('Send email with attachment error:', error);
    return res.status(500).json({ error: 'Failed to send email with attachment', details: error.message });
  }
};
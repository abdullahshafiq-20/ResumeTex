import express from 'express';
import { google } from "googleapis";
import { CoinLog, User, RequestLogs } from "../models/userSchema.js";
import { setupOAuthWithRefreshToken } from "../utils/oauthUtils.js";
import { transporter } from "../utils/transporter.js";
import { coinRequestTemplate, coinApprovalTemplate, coinRejectionTemplate } from "../utils/coinEmailTemplate.js";

export const coinLogController = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const logs = await CoinLog.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const checkCoins = async (userId) => {
    try {
        const userCoins = await User.findOne({ _id:userId });
        // console.log("User coins:", userCoins);
        if(userCoins.coins > 10)
        {
            return false
        }
        return true;

    } catch (error) {
        console.error("Error checking coins:", error);
        return false;

    }
}

// Helper function to send email using user's Gmail account
const sendEmailViaGmail = async (user, to, subject, htmlContent) => {
    try {
        // Check if user has Gmail permission and refresh token
        if (!user.googleRefreshToken || !user.gmail_permission) {
            throw new Error('User not authenticated with Gmail or missing Gmail permissions');
        }

        // Set up OAuth2 client with user's refresh token
        const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);

        // Create Gmail API client
        const gmail = google.gmail({ version: 'v1', auth });

        // Build the email content
        const messageParts = [
            `From: ${user.email}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            'Content-Transfer-Encoding: 7bit',
            '',
            htmlContent
        ];

        const emailContent = messageParts.join('\r\n');

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

        return result.data;
    } catch (error) {
        console.error('Gmail send error:', error);
        throw error;
    }
};

export const requestCoin = async (req, res) => {
    try {
        const userid = req.user.id;
        const email = req.user.email;
        const check = await checkCoins(userid);
        console.log("Check coins:", check);
        
        if (!check) {
            return res.status(400).json({ message: "Already enough coins" });
        }

        // Get user details including refresh token
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if user has Gmail permissions
        if (!user.googleRefreshToken || !user.gmail_permission) {
            return res.status(400).json({ 
                message: "Gmail authentication required. Please reconnect your Google account with Gmail permissions." 
            });
        }

        // Prepare email content
        const subject = "Coin Request";
        const htmlContent = coinRequestTemplate({
            userName: user.name || userid,
            userEmail: email,
            requestedCoins: 20,
            reason: "Testing",
            timestamp: new Date().toISOString()
        });

        // Send email using user's Gmail account
        await sendEmailViaGmail(user, process.env.EMAIL, subject, htmlContent);

        // Create request log
        const logs = await RequestLogs.create({
            userId: userid,
            status: 'Pending'
        });

        res.status(200).json({ message: "Email sent successfully from your Gmail account" });

    } catch (error) {
        console.error('Request coin error:', error);
        if (error.message.includes('Gmail')) {
            return res.status(400).json({ 
                message: error.message,
                requiresReauth: true 
            });
        }
        res.status(500).json({ message: error.message });
    }
}

export const approveRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const log = await RequestLogs.findByIdAndUpdate(requestId, { status: 'Approved' }, { new: true });
        if (!log) {
            return res.status(404).json({ message: "Request not found" });
        }

        const userId = log.userId;
        const updateCoins = await User.findByIdAndUpdate(userId, { $inc: { coins: 20 } }, { new: true });
        const CoinLogEntry = await CoinLog.create({
            userId: userId,
            amount: 20,
            action: 'Coin Request Approved',
            description: 'Your coin request has been approved and 20 coins have been added to your account.'
        });

        const emailData = {
            to: updateCoins.email,
            from: process.env.EMAIL,
            subject: "Coin Request Approved",
            text: "Your coin request has been approved. 20 coins have been added to your account.",
            html: coinApprovalTemplate({
                userName: updateCoins.name,
                approvedCoins: 20,
                newBalance: updateCoins.coins,
                approvalDate : new Date().toISOString(),
                adminNote: "Your request has been approved by the admin. Thank you for your patience."
            })
        }
        console.log("Email data:", emailData);

        await transporter.sendMail(emailData);

        res.status(200).json({ message: "Request approved successfully", log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const rejectRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const log = await RequestLogs.findByIdAndUpdate(requestId, { status: 'Rejected' }, { new: true });
        if (!log) {
            return res.status(404).json({ message: "Request not found" });
        }

        const userId = log.userId;
        const email = await User.findById(userId);
        const emailData = {
            to: email.email,
            from: process.env.EMAIL,
            subject: "Coin Request Rejected",
            text: "Your coin request has been rejected.",
            html: coinRejectionTemplate({
                userName: email.name,
                rejectionDate: new Date().toISOString(),
                adminNote: "Your request has been rejected by the admin."
            })
        }
        console.log("Email data:", emailData);

        await transporter.sendMail(emailData);

        res.status(200).json({ message: "Request rejected successfully", log });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
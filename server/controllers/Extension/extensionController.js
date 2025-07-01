import { User, UserPreferences } from "../../models/userSchema.js";
import { extensionSchema } from "../../models/extensionSchema.js";
import { emitPostCreated, emitPostDeleted } from "../../config/socketConfig.js";
import { triggerStatsUpdate } from "../../utils/trigger.js";
import bcrypt from "bcrypt";
import axios from "axios";


function extractContentInfo(content) {
    // Regular expression for URLs
    // This matches most common URL formats including http, https, ftp, and www prefixes

    //remove any leading or trailing whitespace from the content
    content = content.trim();
    
    // Clean up the content by removing *, **, *** and extra spaces but keep single line breaks
    content = content
        .replace(/\*{1,}/g, '') // Remove all * occurrences (single, double, triple, or more)
        .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
        .replace(/\n{3,}/g, '\n\n') // Replace 3+ consecutive newlines with just 2 newlines
        .trim(); // Remove leading/trailing whitespace again
    
    const urlRegex = /(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?|www\.[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi;

    // Regular expression for email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

    // Extract URLs and emails
    const extractedUrls = content.match(urlRegex) || [];
    const extractedEmails = content.match(emailRegex) || [];

    // Remove duplicates using Set
    const uniqueUrls = [...new Set(extractedUrls)];
    const uniqueEmails = [...new Set(extractedEmails)];

    console.log(content)

    return {
        content,
        extractedUrls: uniqueUrls,
        extractedEmails: uniqueEmails
    };
}

const getJobTitle = async (content) => {
}



export const savePost = async (req, res) => {
    try {
        const { content } = req.body;
        const id = req.user.id; // Assuming email is available in req.user from authentication middleware
        const timestamp = new Date().toISOString();
        console.log("User ID:", id);

        // Clean the content before processing - keep line breaks but remove extra spaces and lines
        const cleanedContent = content
            .replace(/\*{1,}/g, '') // Remove all * occurrences (single, double, triple, or more)
            .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
            .replace(/\n{3,}/g, '\n\n') // Replace 3+ consecutive newlines with just 2 newlines
            .trim(); // Remove leading/trailing whitespace

        // Find user and check if exists
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userid = user._id;
        let data; // Declare data variable in outer scope

        // Use external API to extract information
        try {
            const response = await axios.post("https://jobtitle-extarction-model-nlp.vercel.app/extract/", {
                content: cleanedContent // Use cleaned content for API
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                console.log("Using external API");
                const { extracted_urls, extracted_emails, extracted_hashtags, job_title } = response.data;
                data = await extensionSchema.create({
                    userId: userid,
                    content: cleanedContent, // Save cleaned content
                    extractedUrls: extracted_urls,
                    extractedEmails: extracted_emails,
                    jobTitle: job_title,
                    extractedHashtags: extracted_hashtags,
                    timestamp: timestamp
                });

                console.log("Data saved successfully:", data);
            } else {
                throw new Error("API returned non-200 status");
            }
        } catch (apiError) {
            console.error("Using locally stored function:", apiError.message);
            const { content: localCleanedContent, extractedUrls, extractedEmails } = extractContentInfo(cleanedContent);
            data = await extensionSchema.create({
                userId: userid,
                content: localCleanedContent, // This will be cleaned by extractContentInfo
                extractedUrls: extractedUrls,
                extractedEmails: extractedEmails,
                timestamp: timestamp
            });
        }

        emitPostCreated(userid, data);
        triggerStatsUpdate(userid);

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Post saved successfully",
            data: data
        });
    } catch (error) {
        console.error("Error saving post:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save post",
            error: error.message
        });
    }
}
export const createSecret = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate new secret regardless of whether user had one before
        const newSecret = createExtensionSecret(email);
        const hashedSecret = await bcrypt.hash(newSecret, 10);

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { secret: hashedSecret },
            { new: true }
        );
        console.log("Updated user with new secret:", updatedUser);

        res.status(200).json({
            success: true,
            message: "Secret created successfully",
            secret: newSecret, // Return the unhashed secret to the client
        });
    }
    catch (error) {
        console.error("Error creating secret:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create secret",
            error: error.message
        });
    }
}


export const createExtensionSecret = (email) => {
    //create a random secret include email
    const secret = Math.random().toString(36).substring(2, 15) + email;
    return secret;
}


export const getPosts = async (req, res) => {
    try {
        const { userId } = req.query;
        const posts = await extensionSchema.find({ userId: userId }).sort({ timestamp: -1 });
        if (!posts) {
            return res.status(404).json({ message: "No posts found" });
        }
        return res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            data: posts
        });

    } catch (error) {

        console.error("Error retrieving posts:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve posts",
            error: error.message
        });
    }
}


export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const deletedPost = await extensionSchema.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        emitPostDeleted(deletedPost.userId, deletedPost._id);
        triggerStatsUpdate(deletedPost.userId);
        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: deletedPost
        });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message
        });
    }
}

export const updatePostStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isEmailSent } = req.body;
        const userId = req.user.id;

        const updatedPost = await extensionSchema.findOneAndUpdate(
            { _id: id, userId: userId },
            { isEmailSent: isEmailSent },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Emit socket event for real-time update
        emitPostCreated(userId, updatedPost);

        return res.status(200).json({
            success: true,
            message: "Post status updated successfully",
            data: updatedPost
        });
    } catch (error) {
        console.error("Error updating post status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update post status",
            error: error.message
        });
    }
};
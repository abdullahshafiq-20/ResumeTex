import { User, UserPreferences } from "../../models/userSchema.js";
import { extensionSchema } from "../../models/extensionSchema.js";
import bcrypt from "bcrypt";
import axios from "axios";


function extractContentInfo(content) {
    // Regular expression for URLs
    // This matches most common URL formats including http, https, ftp, and www prefixes
    const urlRegex = /(?:https?|ftp):\/\/[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?|www\.[\w-]+(?:\.[\w-]+)+(?:[\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/gi;

    // Regular expression for email addresses
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;

    // Extract URLs and emails
    const extractedUrls = content.match(urlRegex) || [];
    const extractedEmails = content.match(emailRegex) || [];

    // Remove duplicates using Set
    const uniqueUrls = [...new Set(extractedUrls)];
    const uniqueEmails = [...new Set(extractedEmails)];

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
        const { content, email } = req.body;
        const timestamp = new Date().toISOString();

        // Find user and check if exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userid = user._id;
        let data; // Declare data variable in outer scope

        // Use external API to extract information
        try {
            const response = await axios.post("https://jobtitle-extarction-model-nlp.vercel.app/extract/", {
                content: content
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
                    content: content,
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
            const { extractedUrls, extractedEmails } = extractContentInfo(content);
            data = await extensionSchema.create({
                userId: userid,
                content: content,
                extractedUrls: extractedUrls,
                extractedEmails: extractedEmails,
                timestamp: timestamp
            });
        }

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
        const posts = await extensionSchema.find({ userId: userId });
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
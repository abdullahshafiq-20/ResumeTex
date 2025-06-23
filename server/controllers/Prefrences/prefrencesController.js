import { User, UserPreferences, Email, UserResume } from '../models/userSchema.js';
import mongoose from 'mongoose';



export const updateUserPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = req.body;

        // Update or create user preferences
        const userPreferences = await UserPreferences.findOneAndUpdate(
            { userId },
            { 
                ...updateData,
                userId,
                updatedAt: new Date()
            },
            { 
                new: true, 
                upsert: true, // Create if doesn't exist
                runValidators: true 
            }
        );

        res.status(200).json({
            success: true,
            message: 'User preferences updated successfully',
            data: userPreferences
        });

    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user preferences',
            error: error.message
        });
    }
};
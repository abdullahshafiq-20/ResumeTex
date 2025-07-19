import { User, UserPreferences } from '../../models/userSchema.js';
import mongoose from 'mongoose';
import { emitPreferencesDashboard } from '../../config/socketConfig.js';
import { triggerStatsUpdate } from "../../utils/trigger.js";


export const updateUserPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const { prefId, updateData } = req.body;

        // Update or create user preferences
        const userPreferences = await UserPreferences.findOneAndUpdate(
            { userId, _id: prefId },
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
        emitPreferencesDashboard(userId, userPreferences);
        triggerStatsUpdate(userId);
    } catch (error) {
        console.error('Error updating user preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user preferences',
            error: error.message
        });
    }
};

export const addLinks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { links } = req.body; // links can be an array or a single object

        const user = await User.findById(userId);

        // Normalize to array
        const linksArray = Array.isArray(links) ? links : [links];

        let added = 0;
        for (const link of linksArray) {
            const exists = user.links.some(
                l => l.platform === link.platform && l.url === link.url
            );
            if (!exists) {
                user.links.push(link);
                added++;
            }
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: added > 0 ? 'Links added successfully' : 'No new links added (duplicates skipped)',
            data: user
        });
        emitPreferencesDashboard(userId, user);
        triggerStatsUpdate(userId);
    } catch (error) {
        console.error('Error adding links:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add links',
            error: error.message
        });
    }
}

export const updateLinks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { links } = req.body;
        const { platform, url, _id } = links;
        console.log(platform, url, _id);

        const updateLink = await User.findOneAndUpdate({ _id: userId, "links._id": _id }, { $set: { "links.$.url": url, "links.$.platform": platform } }, { new: true });
        if (!updateLink) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Link updated successfully',
            data: updateLink
        });
        emitPreferencesDashboard(userId, updateLink);
        triggerStatsUpdate(userId);
    } catch (error) {
        console.error('Error updating links:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update links',
            error: error.message
        });
    }
}

export const deleteLink = async (req, res) => {
    try {
        const userId = req.user.id;
        const { platform } = req.body;
        const deleteLink = await User.findOneAndUpdate({ _id: userId, "links.platform": platform }, { $pull: { "links": { platform: platform } } }, { new: true });
        if (!deleteLink) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Link deleted successfully',
            data: deleteLink
        });
        emitPreferencesDashboard(userId, deleteLink);
        triggerStatsUpdate(userId);
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete link',
            error: error.message
        });
    }
}   
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    picture: {
        type: String,
        required: true
    },
    googleRefreshToken: {
        type: String,
        required: true
    },
    onboarded: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

export const User = mongoose.model("User", userSchema);

const userPrefrencesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    preferences: {
        type: Object,
        required: true
    },
    summary: {
        type: String,
        default: ""
    },
    skills: {
        type: [String],
        default: []
    },
    projects: {
        type: Array,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
export const UserPreferences = mongoose.model("UserPreferences", userPrefrencesSchema);
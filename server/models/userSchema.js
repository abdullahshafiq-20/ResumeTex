import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coins: {
        type: Number,
        default: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    subscribed: {
        type: Boolean,
        default: false
    },
    isExtensionConnected: {
        type: Boolean,
        default: false
    },
    picture: {
        type: String,
        required: true
    },
    googleRefreshToken: {
        type: String,
        required: true
    },
    gmail_permission: {
        type: Boolean,
        default: false
    },
    secret: {
        type: String,
        default: null
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
    links: {
        type: [{
            platform: {
                type: String,
                required: true,
                trim: true
            },
            url: {
                type: String,
                required: true,
                trim: true
            }
        }],
        default: []
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

const emailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    linkedInId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "extensionSchema",
        required: true
    },
    resumeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserResume",
        required: true
    },
    isEmailGenerated: {
        type: Boolean,
        default: false
    },
    isEmailSent: {
        type: Boolean,
        default: false
    },
    to: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: false
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
export const Email = mongoose.model("Email", emailSchema);


const userResumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resume_link: {
        type: String,
        required: true
    },
    resume_title: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    file_type: {
        type: String,
        enum: ['pdf', 'tex', 'docx', 'other'],
        default: 'pdf'
    },
    description: {
        type: String,
        default: ''
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
export const UserResume = mongoose.model("UserResume", userResumeSchema);

const coinLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})
export const CoinLog = mongoose.model("CoinLog", coinLogSchema);


const requestLogsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const RequestLogs = mongoose.model("RequestLogs", requestLogsSchema);


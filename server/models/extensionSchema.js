import mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * LinkedIn Post Schema
 * Defines the structure for LinkedIn post data extracted by the extension
 */
const LinkedInPostSchema = new Schema({
  id: {
    type: String,
    description: 'Unique identifier for the post'
  },
  userId: {
    type: String,
    required: true,
    description: 'ID of the user who extracted this post'
  },
  content: {
    type: String,
    required: true,
    description: 'The text content of the LinkedIn post'
  },
  extractedUrls: {
    type: [String],
    default: [],
    description: 'URLs found in the post content'
  },
  extractedEmails: {
    type: [String],
    default: [],
    description: 'Email addresses found in the post content'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    description: 'ISO timestamp of when the post was extracted'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

export const extensionSchema = mongoose.model('LinkedInPost', LinkedInPostSchema);
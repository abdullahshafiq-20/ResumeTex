import mongoose from "mongoose";
import { UserResume, User } from "../models/userSchema.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get directory path for proper .env loading
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file

// Connection string with fallback
const MONGODB_URI = "mongodb+srv://elderbrotherwedding:A_hd3LZtd.PcXBQ@crud.u8eekys.mongodb.net/resumetex?retryWrites=true&w=majority&appName=crud"
console.log("Attempting to connect with:", MONGODB_URI);

// Connect to MongoDB with better error handling
mongoose.connect(MONGODB_URI)
  .then(() => console.log(`Connected to MongoDB at ${MONGODB_URI.split('@')[1] || 'localhost'}`))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit with error
  });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

const seedResumeData = async () => {
  try {
    // Fetch a real user from the database
    console.log("Fetching users from the database...");
    
    let user = null;
    
    // Try using the User model first
    try {
      user = await User.findOne();
      if (user) {
        console.log(`Found user with Mongoose model: ${user._id}`);
      }
    } catch (error) {
      console.log("Could not find user with User model, trying direct collection access");
    }
    
    // If no user found, try accessing the raw collection
    if (!user) {
      try {
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');
        user = await usersCollection.findOne();
        
        if (user) {
          console.log(`Found user with direct collection access: ${user._id}`);
        } else {
          console.error("No users found in the database. Please create at least one user first.");
          return;
        }
      } catch (error) {
        console.error("Error fetching user from collection:", error);
        return;
      }
    }
    
    const userId = user._id.toString();
    console.log(`Seeding resume data for user ID: ${userId}`);
    
    // Clear existing resume data for this user
    const deleteResult = await UserResume.deleteMany({ userId });
    console.log(`Deleted ${deleteResult.deletedCount} existing resume entries`);
    
    // Sample resumes with links - only 3 as requested
    const sampleResumes = [
      {
        userId,
        resume_link: "/uploads/resume-software-engineer.pdf",
        resume_title: "Software Engineer Resume",
        file_type: "pdf",
        description: "My main resume for software engineering roles"
      },
      {
        userId,
        resume_link: "/uploads/resume-fullstack.tex",
        resume_title: "Full Stack Developer Resume",
        file_type: "tex",
        description: "LaTeX version of my full stack resume with more details"
      },
      {
        userId,
        resume_link: "/uploads/resume-frontend.pdf",
        resume_title: "Frontend Developer Resume", 
        file_type: "pdf",
        description: "Resume focused on my frontend development skills"
      }
    ];
    
    console.log("Attempting to insert resume data...");
    
    // Insert the sample resumes
    const result = await UserResume.insertMany(sampleResumes);
    
    console.log(`Successfully seeded ${result.length} resume documents for user ID ${userId}`);
    console.log(result.map(r => ({ 
      id: r._id, 
      title: r.resume_title, 
      file_type: r.file_type
    })));
    
  } catch (error) {
    console.error("Error seeding resume data:", error);
    console.error("Full error:", error.stack);
  } finally {
    console.log("Closing MongoDB connection...");
    try {
      await mongoose.connection.close();
      console.log("Done!");
    } catch (err) {
      console.error("Error closing MongoDB connection:", err);
    }
    process.exit(); // Force exit to avoid hanging
  }
};

seedResumeData();
import dotenv from "dotenv";

dotenv.config();

// Filter out undefined API keys
const apis = [
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
].filter(key => key !== undefined && key !== '');

if (apis.length === 0) {
    console.error("ERROR: No API keys found in environment variables! Check your .env file.");
}

export const getRandomAPIKey = () => {
    if (apis.length === 0) {
        throw new Error("No API keys available. Check your environment variables.");
    }
    const randomIndex = Math.floor(Math.random() * apis.length);
    return apis[randomIndex];
};

console.log(`Found ${apis.length} API keys`);
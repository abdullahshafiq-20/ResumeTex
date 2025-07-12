import { extractPdfData } from "../extractPdfData.js";
import { convertJsonTexToPdfLocally } from "../latexToPdf.js";
import { User, UserPreferences, UserResume } from "../../models/userSchema.js";
import { emitResumeCreated, emitPreferencesDashboard, emitResumeDeleted } from "../../config/socketConfig.js";
import { triggerStatsUpdate } from "../../utils/trigger.js";
import { pdfToImage } from "./onboardResume.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

function extractResumeDetails(text, pref) {
    const result = {
        summary: '',
        skills: [],
        projects: [],
        job_title: pref
    };

    // Extract summary
    const summaryMatch = text.match(/Summary\s+(.*?)\s+Professional Experience/s);
    if (summaryMatch) {
        result.summary = summaryMatch[1].trim().replace(/\s+/g, ' ');
    }

    // Extract skills
    const skillsMatch = text.match(/Skills\s+(.*?)\s+Projects/s);
    if (skillsMatch) {
        const skillsText = skillsMatch[1];
        const skillLines = skillsText
            .split(/—|–|,|\n/)
            .map(s => s.trim())
            .filter(s => s.length > 0 && /^[a-zA-Z0-9]/.test(s));
        result.skills = [...new Set(skillLines)];
    }

    // Extract projects (Fix applied here)
    const projectMatch = text.match(/Projects\s+(.*?)\s+Languages/s);
    if (projectMatch) {
        const projectText = projectMatch[1];

        // Match each project title as a line followed by some description
        const projectLines = [...projectText.matchAll(/^(.*?)(?:\(|–|—)/gm)].map(match =>
            match[1].trim()
        );

        // Remove duplicates and noise
        result.projects = [...new Set(
            projectLines.filter(line =>
                line.length > 2 &&
                !line.toLowerCase().includes('technologies') &&
                !line.toLowerCase().includes('api') &&
                !line.toLowerCase().includes('description')
            )
        )];
    }

    return result;
}

async function parseResumeWithAI(resumeText, pref) {
    try {
        const apiKey = process.env.GEMINI_API_KEY_4;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
You are an expert resume parser. Analyze the following resume text and extract information in the exact JSON format specified below.

IMPORTANT: Return ONLY the JSON object, no additional text or explanations.

Required JSON format:
{
  "summary": "A concise professional summary paragraph",
  "skills": ["skill1", "skill2", "skill3", ...],
  "projects": ["Project Name 1", "Project Name 2", ...],
  "job_title": "Job Title"
}

Guidelines:
1. Summary: Extract same summary as in the resume text
2. Skills: Extract ALL technical skills, programming languages, frameworks, tools, and soft skills mentioned
3. Projects: List project names/titles only (not descriptions)
4. Suggest a good job title for the user based on the skills and projects for example "Software Engineer", "Data Scientist", "Product Manager", "etc."
5. Ensure all arrays are properly formatted
6. Remove any duplicate skills

Resume text to analyze:
${resumeText}

Return only the JSON object:`;

        // const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        //     method: "POST",
        //     headers: {
        //         "Authorization": `Bearer ${apiKey}`,
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         "model": "google/gemma-3n-e4b-it:free",
        //         "messages": [
        //             {
        //                 "role": "user",
        //                 "content": prompt
        //             }
        //         ]
        //     })
        // });
        const response = await model.generateContent(prompt);
        //console.log(response.response.text());

        

        // if (!response.ok) {
        //     throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        // }

        // const data = response.response.text();
        // //console.log(data);

        // if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        //     throw new Error('Invalid API response format');
        // }

        // const aiResponse = data.choices[0].message.content.trim();

        // Clean the response to extract just the JSON
        let jsonString = response.response.text();

        // Remove markdown code blocks if present
        jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');

        // Find JSON object in the response
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }

        // Parse the JSON response
        const parsedResult = JSON.parse(jsonString);

        // Validate the response structure
        if (!parsedResult.summary || !Array.isArray(parsedResult.skills) || !Array.isArray(parsedResult.projects)) {
            throw new Error('Invalid response structure from AI');
        }

        return parsedResult;

    } catch (error) {
        console.error('Error parsing resume with AI:', error);

        // Fallback to basic parsing if AI fails
        console.log("fallback to basic parsing");
        return extractResumeDetails(resumeText, pref);
    }
}   


export const manualResumeController = async (req, res) => {

    const { pdfUrl, pref } = req.body;
    const userId = req.user.id;
    try {
        const { extractedData } = await extractPdfData(pdfUrl);
        const text = extractedData.text;
        const result = await parseResumeWithAI(text, pref);

        console.log("result.job_title: ", result.job_title);

        // res.json({ result });

        const userPreferences = await UserPreferences.create({
            userId: userId,
            preferences: pref || result.job_title,
            summary: result.summary || "",
            skills: result.skills,
            projects: result.projects,
            updatedAt: Date.now()
        });

        // res.json({ result, userPreferences });
        const thumbnail = await pdfToImage(pdfUrl);
        const { imageUrl, publicId: thumbnailPublicId, size, format } = thumbnail;
        const userResume = await UserResume.create({
            userId: userId,
            resume_link: pdfUrl,
            resume_title: pref || result.job_title,
            thumbnail: imageUrl,
            file_type: 'pdf',
            description: '',
            publicId: thumbnailPublicId,
            size: size,
            format: format
        });

        emitResumeCreated(userId, userResume);
        emitPreferencesDashboard(userId, userPreferences);
        triggerStatsUpdate(userId);
        res.status(200).json(userResume);



    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}
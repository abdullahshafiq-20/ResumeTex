import express from 'express';
import { extractPdfData } from "../extractPdfData.js";

function extractResumeDetails(text) {
    const result = {
        summary: '',
        skills: [],
        projects: []
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

async function parseResumeWithAI(resumeText, apiKey) {
    try {
        const prompt = `
You are an expert resume parser. Analyze the following resume text and extract information in the exact JSON format specified below.

IMPORTANT: Return ONLY the JSON object, no additional text or explanations.

Required JSON format:
{
  "summary": "A concise professional summary paragraph",
  "skills": ["skill1", "skill2", "skill3", ...],
  "projects": ["Project Name 1", "Project Name 2", ...]
}

Guidelines:
1. Summary: Extract same summary as in the resume text
2. Skills: Extract ALL technical skills, programming languages, frameworks, tools, and soft skills mentioned
3. Projects: List project names/titles only (not descriptions)
4. Ensure all arrays are properly formatted
5. Remove any duplicate skills

Resume text to analyze:
${resumeText}

Return only the JSON object:`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemma-3n-e4b-it:free",
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid API response format');
        }

        const aiResponse = data.choices[0].message.content.trim();

        // Clean the response to extract just the JSON
        let jsonString = aiResponse;

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
        return extractResumeDetails(resumeText);
    }
}


export const manualResumeController = async (req, res) => {

    const { pdfUrl } = req.body;
    const userId = req.user.id;
    const { extractedData } = await extractPdfData(pdfUrl);
    const text = extractedData.text;
    const result = await parseResumeWithAI(text, process.env.OPENROUTER_API_KEY_1);
    triggerStatsUpdate(userId);

    // const validatedResult = validateAndCleanResult(result);

    res.json({ result });

}
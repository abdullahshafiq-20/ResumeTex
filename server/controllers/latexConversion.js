import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLatexPrompt, getLatexPromptJobTitle, getLatexPromptJobDescription } from '../services/promptServices.js';

import { generateCVLatexTemplate2_new } from '../utils/templateV2_new.js';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();


const CV_STRUCTURE = `{
          "cv_template": {
            "metadata": {
              "section_order": [
                "header", "summary", "experience", "education", "skills", "projects", "certifications", "courses", "languages", "volunteer", "achievements", "publications", "interests", "references", 'patents', 'research', 'custom'
              ]
            },
            "sections": {
              "header": {
                "name": "Your Full Name",
                "title": "Your Professional Title, e.g., Software Engineer",
                "contact_info": {
                  "email": {"value": "Your Email", "link": "mailto:Your Email"},
                  "phone": {"value": "Your Phone Number", "link": "tel:Your Phone Number"},
                  "portfolio": {"value": "Your Portfolio URL", "link": "Your Portfolio URL"},
                  "linkedin": {"value": "Your LinkedIn Profile", "link": "LinkedIn Profile URL"},
                  "location": {"value": "City, Country"}
                }
              },
              "summary": {
                "section_title": "Summary",
                "content": "Brief professional summary highlighting your experience, skills, and career goals."
              },
              "experience": {
                "section_title": "Professional Experience",
                "items": [
                  {
                    "type": "job",
                    "title": "Job Title",
                    "company": "Company Name",
                    "url": "Company URL",
                    "location": "City, Country",
                    "dates": {"start": "Start Date", "end": "End Date", "is_current": false},
                    "achievements": [
                      "Achievement 1",
                      "Achievement 2"
                    ],
                    "technologies": ["Technology 1", "Technology 2"]
                  }
                ]
              },
              "education": {
                "section_title": "Education",
                "items": [
                  {
                    "degree": "Degree Title",
                    "institution": "Institution Name",
                    "url": "Institution URL",
                    "location": "City, Country",
                    "dates": {"start": "Start Date", "end": "End Date"},
                    "gpa": "GPA",
                    "honors": ["Honor or Award"]
                  }
                ]
              },
              "skills": {
                "section_title": "Skills",
                "categories": [
                  {
                    "name": "Technical Skills",
                    "items": ["Skill 1", "Skill 2"],
                    "description": "Short description based on data",
                    "proficiency": "expert"
                  },
                  {
                    "name": "Soft Skills",
                    "items": ["Skill 1", "Skill 2"],
                    "description": "Short description based on data",
                    "proficiency": "intermediate"
                  }
                ]
              },
              "projects": {
                "section_title": "Projects",
                "items": [
                  {
                    "title": "Project Title",
                    "url": "Project URL",
                    "description": "Project Description",
                    "dates": {"start": "Start Date", "end": "End Date"},
                    "technologies": ["Technology 1", "Technology 2"],
                    "key_contributions": ["Contribution 1", "Contribution 2"]
                  }
                ]
              },
              "certifications or courses": {
                "section_title": "Certifications",
                "items": [
                  {
                    "title": "Certification Name",
                    "institution": "Issuing Institution",
                    "url": "Certification URL",
                    "date": {"start": "Start Date", "end": "End Date"},
                  }
                ]
              },
              "languages": {
                "section_title": "Languages",
                "items": [
                  {"name": "Language", "proficiency": "Proficiency Level"}
                ]
              },
              "volunteer": {
                "section_title": "Volunteer Experience",
                "items": [
                  {
                    "title": "Volunteer Role",
                    "organization": "Organization Name",
                    "location": "City, Country",
                    "dates": {"start": "Start Date", "end": "End Date"},
                    "achievements": ["Achievement 1"]
                  }
                ]
              },
              "achievements": {
                section_title: "Awards & Achievements",
                items: [
                    {
                        organization: "Example Organization",
                        description: "Achievement description",
                        date: "2023-01-01"
                    }
                ]
              },
              "publications": {
                "section_title": "Publications",
                "items": [
                  {
                    "title": "Publication Title",
                    "url": "Publication URL",
                    "date": "Publication Date"
                  }
                ]
              },
              "interests": {
                "section_title": "Interests",
                "items": ["Interest 1", "Interest 2"]
              },
              "references": {
                "section_title": "References",
                "items": [
                  {
                    "name": "Reference Name",
                    "title": "Title",
                    "company": "Company Name",
                    "email": "Email",
                    "phone": "Phone Number"
                  }
                ]
              },

              patents: {
                section_title: "Patents",
                items: [
                    {
                        title: "Patent Title",
                        number: "Patent Number",
                        url: "Patent URL",
                        date: "2023-01-01"
                    }
                ]
              },
              research: {
                section_title: "Research",
                items: [
                    {
                        title: "Research Title",
                        description: "Research Description",
                        url: "Research URL",
                        date: "2023-01-01"
                    }
                ]
              },
              custom: {
                section_title: "Custom Section",
                items: [
                    {
                        title: "Custom Item Title",
                        description: "Custom Item Description",
                        url: "Custom Item URL",
                        date: "2023-01-01"
                    }
                ]
              }
            },
            "rendering_rules": {
              "date_format": "MMM YYYY",
              "hide_empty_sections": true,
              "max_items_per_section": "No limit for now",
              "truncate_descriptions_at": 600
            }
          }
        }`;


// As a senior HR data analyst specializing in ATS optimization, transform the following JSON CV data into a highly optimized, ATS-friendly format with emphasis on quantifiable achievements and industry-specific keywords:

// ${data}

// CRITICAL ATS OPTIMIZATION INSTRUCTIONS:
// 1. KEYWORD TARGETING: Embed industry-specific keywords at 3-5% density in summary and experience sections.
// 2. QUANTIFY RESULTS: Transform all achievements into metrics (↑35% revenue, $500K savings, 12 team members).
// 3. POWER VERBS: Lead each bullet with strong action verbs (Spearheaded, Orchestrated, Implemented).
// 4. ATS-COMPATIBLE FORMAT: Eliminate tables, columns, special characters, and complex formatting.
// 5. TECHNICAL SPECIFICITY: List precise versions of tools, technologies, and methodologies with proficiency levels.
// 6. COMPELLING SUMMARY: Craft a 3-line summary with years of experience, expertise, and unique value proposition.
// 7. STRATEGIC STRUCTURE: Use consistent formatting with logical progression and appropriate white space.
// 8. INDUSTRY TERMINOLOGY: Replace generic language with precise industry terms that match ATS algorithms.
// 9. REVERSE CHRONOLOGY: Present most recent experience first with standardized date formats (MMM YYYY).
// 10. VERIFICATION DATA: Include certification IDs, license numbers, and other verifiable credentials.

// Return a structured CV in this format:
// ${CV_STRUCTURE}

// MOST IMPORTANT INSTRUCTIONS TO FOLLOW:
// 1.Extract and categorize all sections from input text and utilize all the provided data.
// 2.Match links to corresponding sections/items.
// 3.Consume all the provided data in the structured CV. Do not respond with placeholders like "rest of the data...".
// 4.Ensure all content is ATS-friendly by avoiding excessive formatting, symbols, or images. Use clear, keyword-optimized descriptions relevant to the job industry.
// 5.Integrate numeric analytics wherever applicable (e.g., "Increased efficiency by 30%", "Managed a budget of $50K", "Led a team of 10 developers").
// 6.Do not include additional CV sections outside the ones defined in the sections object. If data exists for an undefined section, integrate it into the closest relevant category.
// 7.Ensure all dates follow the "MMM YYYY" format.
// 8.Preserve all URLs and links in their respective fields.
// 9.If descriptions are vague, enhance them while keeping the original meaning intact.
// 10.Utilize all provided data comprehensively while maintaining a professional, structured format.
// 11.KEYWORD OPTIMIZATION: For each achievement, identify and incorporate at least one industry-specific keyword.
// 12.ACTION VERB VARIETY: Use diverse, impactful action verbs at the beginning of each achievement bullet (e.g., "Spearheaded," "Implemented," "Orchestrated").
// 13.ACHIEVEMENT-FOCUSED: Transform responsibility statements into achievement statements with measurable outcomes.
// 14.TECHNICAL SPECIFICATION: Include specific versions, methodologies, and frameworks where applicable.
// 15.Just return the structured CV data in the specified format. Do not include any additional text or instructions.

const ExtractPrefrences = (extractedData) => {
  const prompt = `
  you are given a task to extract the prefrences from the extracted data.
  the extracted data is: ${extractedData}
  you need to return the respoosne in the followig format
  `
}




export const ConvertLatex = async (extractedData, jobTitle, apiKey, genmodel, manual = false) => {
  let latexContent = '';
  try {
    const LATEX_CONVERSION_PROMPT = await getLatexPromptJobTitle(extractedData, jobTitle, CV_STRUCTURE);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: genmodel || "gemini-2.0-flash" });
    const result = await model.generateContent(LATEX_CONVERSION_PROMPT);
    latexContent = result.response.text();
    console.log("Response received from Gemini API");
    console.log("Processing AI response");

    // Clean up the response - remove markdown code blocks and any extra whitespace
    latexContent = latexContent.replace(/```json\n?/g, '')  // Remove ```json
      .replace(/```\n?/g, '')
      .replace(/\*\*/g, '')       // Remove closing ```
      .trim(); 

      

    let parsedData;
    try {
      parsedData = JSON.parse(latexContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', latexContent);
      return { error: 'Failed to parse AI response' };
    }

    // Generate the formatted LaTeX
    const email = parsedData.cv_template.sections.header.contact_info.email.value;
    const name = parsedData.cv_template.sections.header.name;
    const title = parsedData.cv_template.sections.header.title;
    const summary = parsedData?.cv_template?.sections?.summary?.content || '';

    // Skills with type checking and fallback
    const skills = Array.isArray(parsedData?.cv_template?.sections?.skills?.categories)
      ? parsedData.cv_template.sections.skills.categories
      : [];

    // Projects with type checking and fallback
    const projects = Array.isArray(parsedData?.cv_template?.sections?.projects?.items)
      ? parsedData.cv_template.sections.projects.items
      : [];
    console.log("email:", email);
    const formattedLatex = generateCVLatexTemplate2_new(parsedData);

    console.log("Formatted LaTeX generated successfully");
    return { formattedLatex, email, name, title, summary, skills, projects };


  } catch (error) {
    console.error('LaTeX conversion error:', error);
    return { error: 'LaTeX conversion failed' };
  }
};
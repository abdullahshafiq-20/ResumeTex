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




export const ConvertLatex = async (extractedData, jobTitle, apiKey) => {
  let latexContent = '';
    try {
        const LATEX_CONVERSION_PROMPT = await getLatexPromptJobTitle(extractedData, jobTitle, CV_STRUCTURE);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});
        const result = await model.generateContent(LATEX_CONVERSION_PROMPT);
        latexContent = result.response.text();
        console.log("Response received from Gemini API");
        console.log("Processing AI response");
        
        // Clean up the response - remove markdown code blocks and any extra whitespace
        latexContent = latexContent.replace(/```json\n?/g, '')  // Remove ```json
                               .replace(/```\n?/g, '')        // Remove closing ```
                               .trim();                       // Remove extra whitespace

        let parsedData;
        try {
            parsedData = JSON.parse(latexContent);
        } catch (parseError) {
            console.error('Failed to parse AI response:', latexContent);
            return  { error: 'Failed to parse AI response' };
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
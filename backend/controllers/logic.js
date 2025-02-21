import axios from "axios"
import pdfjsLib from "pdfjs-dist";
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateCVLatexTemplateV1 }  from "../utils/templateV1.js"
import { generateCVLatexTemplateV2 }  from "../utils/templateV2.js"
// import  convertJsonTexToPdf  from "../utils/JsonTextoPdf.js"
import dotenv from 'dotenv';
import { generateCVLatexTemplateV3 } from "../utils/templateV3.js";
import { log } from "console";
dotenv.config();


// Configure the worker
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');

export const extractPdfData = async (req, res) => {
    try {
        const { pdfUrl } = req.body;
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        // Download PDF
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data, 'binary');

        // Parse PDF
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let extractedText = '';
        const links = [];

        // Process each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedText += pageText + '\n';

            // Process annotations for hyperlinks
            const annotations = await page.getAnnotations();
            annotations.forEach(annotation => {
                if (annotation.subtype === 'Link' && annotation.url) {
                    const rect = annotation.rect;
                    const xMin = Math.min(rect[0], rect[2]);
                    const xMax = Math.max(rect[0], rect[2]);
                    const yMin = Math.min(rect[1], rect[3]);
                    const yMax = Math.max(rect[1], rect[3]);
                    let anchorText = '';
                    textContent.items.forEach(item => {
                        const x = item.transform[4];
                        const y = item.transform[5];
                        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                            anchorText += item.str + ' ';
                        }
                    });
                    anchorText = anchorText.trim().replace(/\s+/g, ' ');
                    if (anchorText) {
                        links.push({ url: annotation.url, context: anchorText });
                    }
                }
            });

            // Process URLs found in text content
            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            let match;
            while ((match = urlRegex.exec(pageText)) !== null) {
                const url = match[0];
                const start = match.index;
                const end = start + url.length;
                const contextStart = Math.max(0, start - 30);
                const contextEnd = Math.min(pageText.length, end + 30);
                let context = pageText.slice(contextStart, contextEnd);
                // Clean up the context to avoid truncated words
                context = context.replace(/^\S*\s/, '').replace(/\s\S*$/, '');
                links.push({ url, context });
            }
        }

        const extractedData = {
            text: extractedText,
            links
        };


        // const latexContent = await ConvertLatex(extractedData, template);
        // const link = await convertJsonTexToPdf(latexContent);

        res.json({
          extractedData
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};

export const ConvertLatex = async (req, res) => {
    const { extractedData, template, model: modelName, apiProvider } = req.body;
    console.log("apiProvider", apiProvider);
    console.log("model", modelName);

    let apikey;
    // Select API key based on provider
    switch(apiProvider) {
        case 'api_1':
            apikey = process.env.GEMINI_API_KEY_1;
            break;
        case 'api_2':
            apikey = process.env.GEMINI_API_KEY_2;
            break;
        case 'api_3':
            apikey = process.env.GEMINI_API_KEY_3;
            break;
        case 'api_4':
            apikey = process.env.GEMINI_API_KEY_4;
            break;
        case 'api_5':
            apikey = process.env.GEMINI_API_KEY_5;
            break;
        default:
            return res.status(400).json({ error: 'Invalid API provider specified' });
    }

    if (!apikey) {
        return res.status(500).json({ error: 'API key not configured for specified provider' });
    }

    try {
        const genAI = new GoogleGenerativeAI(apikey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const LATEX_CONVERSION_PROMPT = `As a data analyst, analyze and structure the following JSON CV data:

        ${JSON.stringify(extractedData)}
        
        Return a structured CV in this format:
        {
          "cv_template": {
            "metadata": {
              "section_order": [
                "header", "summary", "experience", "education", "skills", "projects", "certifications", "courses", "languages", "volunteer", "awards", "publications", "interests", "references", 'achievements', 'patents', 'research', 'custom'
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
              "awards": {
                "section_title": "Awards & Achievements",
                "items": ["Award Name and Date"]
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
              achievements: {
                section_title: "Awards & Achievements",
                items: [
                    {
                        organization: "Example Organization",
                        description: "Achievement description",
                        date: "2023-01-01"
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
        }
        
        Instructions:
        1. Extract and categorize all sections from input text
        2. Match links to corresponding sections/items
        3. Consume all the provided data in the structured CV, dont repsond like "rest of the data....."
        4. Dont include any additional CV sections in the sections object, if you dont have the data for a section, dont include it in the JSON and if there is section which is not in the sections object, ajdust this data in the sections i have defined above. 
        5. Ensure all dates follow MMM YYYY format
        6. Preserve all URLs and links in their respective fields
        7. If you see there are some description which are not upto the mark you are open to modify them but make sure the meaning of the description is not changed.
        8. Utilize all the data, it is vey important`;

        const result = await model.generateContent(LATEX_CONVERSION_PROMPT);
        console.log("calling gemini api")
        const response = result.response;

        // console.log("response:", response);

        console.log("response from gemini api");
        let latexContent = response.text();

        // console.log("latexContent:", latexContent);
        
        
        // Clean up the response - remove markdown code blocks and any extra whitespace
        latexContent = latexContent.replace(/```json\n?/g, '')  // Remove ```json
                                 .replace(/```\n?/g, '')        // Remove closing ```
                                 .trim();                       // Remove extra whitespace

        let parsedData;
        try {
            parsedData = JSON.parse(latexContent);
        } catch (parseError) {
            console.error('Failed to parse AI response:', latexContent);
            return res.status(500).json({ error: 'Failed to parse AI response' });
        }
        
        // Generate the formatted LaTeX
        const email = parsedData.cv_template.sections.header.contact_info.email.value;
        console.log("email:", email);
        let formattedLatex;
        if (template === 'v2') {
            formattedLatex = generateCVLatexTemplateV2(parsedData);

        } else if (template === 'v1') {
            formattedLatex = generateCVLatexTemplateV1(parsedData);
        }
        else {
          formattedLatex = generateCVLatexTemplateV3(parsedData);
        }
        // console.log("formattedLatex:", formattedLatex);
        
        res.json({ formattedLatex, email });
    } catch (error) {
        console.error('LaTeX conversion error:', error);
        res.status(500).json({ error: 'Failed to convert to LaTeX: ' + error.message });
    }
};


export const convertJsonTexToPdf = async (req, res) => {
  const { formattedLatex } = req.body;
  try {
      const response = await axios.post(
          'https://api.advicement.io/v1/templates/pub-tex-to-pdf-with-pdflatex-v1/compile',
          {
              texFileContent: formattedLatex
          },
          {
              headers: {
                  'Adv-Security-Token': process.env.ADVICEMENT_API_TOKEN,
                  'Content-Type': 'application/json'
              }
          }
      );

      const statusUrl = response.data.documentStatusUrl;
      console.log('Status URL:', statusUrl);
      
      if (!statusUrl) {
          return res.status(400).json({ error: 'Status URL not found in the initial response' });
      }

      let attempts = 0;
      const maxAttempts = 5;
      const delayBetweenAttempts = 5000;

      while (attempts < maxAttempts) {
          const statusResponse = await axios.get(statusUrl);
          console.log(`Attempt ${attempts + 1} - Status response:`, statusResponse.data);

          if (!statusResponse.data) {
              return res.status(400).json({ error: 'Invalid response from status endpoint' });
          }

          const pdfUrl = statusResponse.data.documentUrl;
          console.log(`Attempt ${attempts + 1} - PDF URL:`, pdfUrl);

          if (pdfUrl) {
              return res.json({ pdfUrl }); // Return immediately when URL is found
          }

          // Only wait if we haven't reached max attempts
          if (attempts < maxAttempts - 1) {
              console.log(`PDF not ready yet. Waiting ${delayBetweenAttempts/1000} seconds before retry...`);
              await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
          }

          attempts++;
      }

      // If we get here, we've exhausted all attempts without finding a URL
      return res.status(408).json({ error: 'PDF URL not found after multiple attempts' });

  } catch (error) {
      console.error('Error converting LaTeX to PDF:', {
          message: error.message,
          response: error.response?.data
      });
      return res.status(500).json({ 
          error: `LaTeX to PDF conversion failed: ${error.message}`
      });
  }
}




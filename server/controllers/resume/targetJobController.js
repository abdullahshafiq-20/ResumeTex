
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { extractPdfData } from "../extractPdfData.js";
import { convertJsonTexToPdfLocally } from "../latexToPdf.js";
import { generateCVLatexTemplate2_new } from "../../utils/templateV2_new.js";
dotenv.config();

const CV_STRUCTURE_WITH_CHANGES = `{
    "cv_template": {
      "metadata": {
        "section_order": [
          "header", "summary", "experience", "education", "skills", "projects", "certifications", "courses", "languages", "volunteer", "achievements", "publications", "interests", "references", "patents", "research", "custom"
        ]
      },
      "sections": {
        "header": {
          "name": "Your Full Name",
          "title": {
            "from": "Your Professional Title, e.g., Software Engineer",
            "to": ""
          },
          "contact_info": {
            "email": {
              "value": "Your Email",
              "link": "mailto:Your Email"
            },
            "phone": {
              "value": "Your Phone Number",
              "link": "tel:Your Phone Number"
            },
            "portfolio": {
              "value": "Your Portfolio URL",
              "link": "Your Portfolio URL"
            },
            "linkedin": {
              "value": "Your LinkedIn Profile",
              "link": "LinkedIn Profile URL"
            },
            "location": {
              "value": "City, Country"
            }
          }
        },
        "summary": {
          "section_title": "Summary",
          "content": {
            "from": "Brief professional summary highlighting your experience, skills, and career goals.",
            "to": ""
          }
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
              "dates": {
                "start": "Start Date",
                "end": "End Date",
                "is_current": false
              },
              "achievements": [
                {
                  "from": "Achievement 1",
                  "to": ""
                },
                {
                  "from": "Achievement 2",
                  "to": ""
                }
              ],
              "technologies": [
                "Technology 1",
                "Technology 2"
              ]
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
              "dates": {
                "start": "Start Date",
                "end": "End Date"
              },
              "gpa": "GPA",
              "honors": ["Honor or Award"]
            }
          ]
        },
        "skills": {
          "section_title": "Skills",
          "categories": [
            {
              "name": {
                "from": "Technical Skills",
                "to": ""
              },
              "items": [
                {
                  "from": "Skill 1",
                  "to": ""
                },
                {
                  "from": "Skill 2",
                  "to": ""
                }
              ],
              "description": {
                "from": "Short description based on data",
                "to": ""
              },
              "proficiency": {
                "from": "expert",
                "to": ""
              }
            },
            {
              "name": {
                "from": "Soft Skills",
                "to": ""
              },
              "items": [
                {
                  "from": "Skill 1",
                  "to": ""
                },
                {
                  "from": "Skill 2",
                  "to": ""
                }
              ],
              "description": {
                "from": "Short description based on data",
                "to": ""
              },
              "proficiency": {
                "from": "intermediate",
                "to": ""
              }
            }
          ]
        },
        "projects": {
          "section_title": {
            "from": "Projects",
            "to": ""
          },
          "items": [
            {
              "title": {
                "from": "Project Title",
                "to": ""
              },
              "url": {
                "from": "Project URL",
                "to": ""
              },
              "description": {
                "from": "Project Description",
                "to": ""
              },
              "dates": {
                "start": {
                  "from": "Start Date",
                  "to": ""
                },
                "end": {
                  "from": "End Date",
                  "to": ""
                }
              },
              "technologies": [
                {
                  "from": "Technology 1",
                  "to": ""
                },
                {
                  "from": "Technology 2",
                  "to": ""
                }
              ],
              "key_contributions": [
                {
                  "from": "Contribution 1",
                  "to": ""
                },
                {
                  "from": "Contribution 2",
                  "to": ""
                }
              ]
            }
          ]
        },
        "certifications": {
          "section_title": "Certifications",
          "items": [
            {
              "title": "Certification Name",
              "institution": "Issuing Institution",
              "url": "Certification URL",
              "date": {
                "start": "Start Date",
                "end": "End Date"
              }
            }
          ]
        },
        "courses": {
          "section_title": "Courses",
          "items": [
            {
              "title": "Course Name",
              "institution": "Institution Name",
              "url": "Course URL",
              "date": {
                "start": "Start Date",
                "end": "End Date"
              }
            }
          ]
        },
        "languages": {
          "section_title": "Languages",
          "items": [
            {
              "name": "Language",
              "proficiency": {
                "from": "Proficiency Level",
                "to": ""
              }
            }
          ]
        },
        "volunteer": {
          "section_title": "Volunteer Experience",
          "items": [
            {
              "title": "Volunteer Role",
              "organization": "Organization Name",
              "location": "City, Country",
              "dates": {
                "start": "Start Date",
                "end": "End Date"
              },
              "achievements": [
                {
                  "from": "Achievement 1",
                  "to": ""
                }
              ]
            }
          ]
        },
        "achievements": {
          "section_title": "Awards & Achievements",
          "items": [
            {
              "organization": "Example Organization",
              "description": {
                "from": "Achievement description",
                "to": ""
              },
              "date": ""
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
              },
            }
          ]
        },
        "interests": {
          "section_title": "Interests",
          "items": [
            {
              "from": "Interest 1",
              "to": ""
            },
            {
              "from": "Interest 2",
              "to": ""
            }
          ]
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
        "patents": {
          "section_title": "Patents",
          "items": [
            {
              "title": "Patent Title",
              "number": "Patent Number",
              "url": "Patent URL",
              "date": "2023-01-01"
            }
          ]
        },
        "research": {
          "section_title": "Research",
          "items": [
            {
              "title": "Research Title",
              "description": {
                "from": "Research Description",
                "to": ""
              },
              "url": "Research URL",
              "date": "2023-01-01"
            }
          ]
        },
        "custom": {
          "section_title": "Custom Section",
          "items": [
            {
              "title": "Custom Item Title",
              "description": {
                "from": "Custom Item Description",
                "to": ""
              },
              "url": "Custom Item URL",
              "date": "2023-01-01"
            }
          ]
        }
      },
      "job_match_assessment": {
        "job_match_percentage": "Job Match Percentage",
        "improvement_recommendations": "Improvement Recommendations"
      },
      "apply" : true/false,
      "rendering_rules": {
        "date_format": "MMM YYYY",
        "hide_empty_sections": true,
        "max_items_per_section": "No limit for now",
        "truncate_descriptions_at": 600
      }
    }
  }`;


const getConversionPrompt = (jobTitle, jobDescription, data, CV_STRUCTURE_WITH_CHANGES) => {
    const PROMPT_LATEX_CONVERSION = ` 
  As a senior HR data analyst specializing in ATS optimization, transform the following JSON CV data into a highly optimized, ATS-friendly format tailored specifically for a ${jobTitle} position with the following job description:
  
            "${jobDescription}"
  
            Emphasize quantifiable achievements and industry-specific keywords that match the job description:
  
            ${data}
  
  CRITICAL ATS OPTIMIZATION INSTRUCTIONS:
  1. KEYWORD TARGETING: Extract and embed keywords from the job description at 3–5% density in summary and experience sections.
  2. QUANTIFY RESULTS: Transform all achievements into metrics (↑35% revenue, $500K savings, 12 team members).
  3. POWER VERBS: Lead each bullet with strong action verbs (Spearheaded, Orchestrated, Implemented) that match requirements in the job description.
  4. ATS-COMPATIBLE FORMAT: Eliminate tables, columns, special characters, and complex formatting.
  5. TECHNICAL SPECIFICITY: List precise versions of tools, technologies, and methodologies with proficiency levels mentioned in the job description.
  6. COMPELLING SUMMARY: Craft a 3-line summary highlighting years of experience, expertise, and unique value proposition that directly addresses job requirements.
  7. STRATEGIC STRUCTURE: Use consistent formatting with logical progression and appropriate white space.
  8. INDUSTRY TERMINOLOGY: Replace generic language with precise industry terms from the job description that match ATS algorithms.
  9. REVERSE CHRONOLOGY: Present most recent experience first with standardized date formats (MMM YYYY).
  10. VERIFICATION DATA: Include certification IDs, license numbers, and other verifiable credentials relevant to requirements in the job description.
  
    CRITICAL FROM/TO MAPPING INSTRUCTIONS:
    - The CV structure contains "from" and "to" fields for every editable value
    - "from" field: For every field, copy the exact value from the original resume data into the "from" key WITHOUT thinking, summarizing, interpreting, or enhancing it. Just map it as-is — letter-for-letter, word-for-word — regardless of grammar or formatting. This acts as the immutable source of truth for later comparison.
    - "from" is the value that will be used to match and locate the corresponding element in the original resume data.
    - You MUST always populate the "from" field using the original data AS IS — completely independent of the job title or job description. It must reflect the actual resume input without any consideration, enhancement, or filtering based on context.
    - "to" field: Provide your suggested, optimized, ATS-friendly version that is appropriate and tailored to the job description requirements

  - If no changes are needed for a particular field, leave the "to" field empty ("")
  - For array items (achievements, technologies, skills), map each original item to its improved version
  - Maintain the exact structure but populate both "from" (original as-is) and "to" (suggested optimized) values
  - This allows for clear tracking of what was changed and how it was improved
  
  Return a structured CV in this format:
  ${CV_STRUCTURE_WITH_CHANGES}
  
  MOST IMPORTANT INSTRUCTIONS TO FOLLOW:
  1. Extract and categorize all sections from input text and utilize all the provided data.
  2. Match links to corresponding sections/items.
  3. Consume all the provided data in the structured CV. Do not respond with placeholders like "rest of the data...".
  4. MAPPING REQUIREMENT: For every field with "from" and "to" structure:
     - "from": Use the original data EXACTLY AS IS from the input — no modifications whatsoever
     - "to": Provide your suggested, appropriate optimization tailored to the job description
  5. Ensure all content is ATS-friendly by avoiding excessive formatting, symbols, or images.
  6. Integrate numeric analytics wherever applicable (e.g., "Increased efficiency by 30%", "Managed a budget of $50K", "Led a team of 10 developers").
  7. Do not include additional CV sections outside the ones defined in the sections object.
  8. Ensure all dates follow the "MMM YYYY" format.
  9. Preserve all URLs and links in their respective fields.
  10. If descriptions are vague, enhance them while keeping the original meaning intact and aligning with job description.
  11. Utilize all provided data comprehensively while maintaining a professional, structured format.
  12. KEYWORD OPTIMIZATION: For each achievement, identify and incorporate at least one keyword from the job description in the "to" field.
  13. ACTION VERB VARIETY: Use diverse, impactful action verbs at the beginning of each achievement bullet that align with the responsibilities in the job description in the "to" field.
  14. ACHIEVEMENT-FOCUSED: Transform responsibility statements into achievement statements with measurable outcomes that demonstrate qualification for the specific job requirements in the "to" field.
  15. TECHNICAL SPECIFICATION: Include specific versions, methodologies, and frameworks mentioned in the job description in the "to" field.
  16. SKILL PRIORITIZATION: Rearrange skills section to highlight those most relevant to the job description first in the "to" field.
  17. CHANGE TRACKING: Every modification you make should be clearly visible by comparing "from" (original as-is) vs "to" (suggested improvement) values.
  18. JOB MATCH ASSESSMENT: After completing the CV optimization, provide a job match percentage assessment:
      - 75% or higher: Tell me to apply!
      - Below 75%: Don't apply yet! Tell me EXACTLY what skills are missing or weak on my resume. Then, give me step-by-step instructions on how to fix it:
        * Should I add new bullet points? If so, tell me what those bullet points should say, using keywords from the job description.
        * Should I rewrite existing bullet points? If so, tell me exactly which ones to rewrite and give me the improved versions.
  19. Just return the structured CV data in the specified format, followed by the job match assessment. Do not include any additional text or instructions.
  
  REMEMBER: 
  - "from" = original data AS IS (means map the original data exactly as it appears)
  - "to" = your suggested improvement appropriate to the job description
  - Provide job match percentage and improvement recommendations at the end
  - return only json format, no other text or comments
  `;

    return PROMPT_LATEX_CONVERSION;
};


const parseJson = (json) => {
    json = json.replace(/```json\n?/g, '')  // Remove ```json
        .replace(/```\n?/g, '')
        .replace(/\*\*/g, '')       // Remove closing ```
        .trim();

    let parsedData;
    try {
        parsedData = JSON.parse(json);
    } catch (parseError) {
        console.error('Failed to parse AI response:', json);
        return { error: 'Failed to parse AI response' };
    }
    return parsedData;
}

const Response =
{
    "cv_template": {
        "metadata": {
            "section_order": [
                "header",
                "summary",
                "experience",
                "education",
                "skills",
                "projects",
                "certifications",
                "courses",
                "languages",
                "volunteer",
                "achievements",
                "publications",
                "interests",
                "references",
                "patents",
                "research",
                "custom"
            ]
        },
        "sections": {
            "header": {
                "name": "Jane Doe",
                "title": {
                    "from": "Full Stack Developer",
                    "to": "MERN Stack Software Engineer"
                },
                "contact_info": {
                    "email": {
                        "value": "jane.doe@example.com",
                        "link": "mailto:jane.doe@example.com"
                    },
                    "phone": {
                        "value": "(555) 123-4567",
                        "link": "tel:(555) 123-4567"
                    },
                    "portfolio": {
                        "value": "https://janedoe.dev",
                        "link": "https://janedoe.dev"
                    },
                    "linkedin": {
                        "value": "https://www.linkedin.com/in/janedoe",
                        "link": "https://www.linkedin.com/in/janedoe"
                    },
                    "location": {
                        "value": "San Francisco, CA"
                    }
                }
            },
            "summary": {
                "section_title": "Summary",
                "content": {
                    "from": "Experienced Full Stack Developer with 3 years of experience in web application development. Proficient in JavaScript frameworks and database management. Seeking to apply my skills in a dynamic environment.",
                    "to": "Highly skilled MERN Stack Software Engineer with 3+ years of experience in developing and optimizing scalable, user-centric full-stack web applications. Expert in crafting efficient REST APIs and writing clean, maintainable code using MongoDB, Express.js, React.js, and Node.js. Proven ability to collaborate with cross-functional teams to deliver innovative technical solutions for complex real-world problems."
                }
            },
            "experience": {
                "section_title": "Professional Experience",
                "items": [
                    {
                        "type": "job",
                        "title": "Software Developer",
                        "company": "Tech Solutions Inc.",
                        "url": "https://techsolutions.com",
                        "location": "San Francisco, CA",
                        "dates": {
                            "start": "Jan 2021",
                            "end": "Current",
                            "is_current": true
                        },
                        "achievements": [
                            {
                                "from": "Developed and maintained web applications.",
                                "to": "Architected and developed robust full-stack web applications using the MERN Stack (MongoDB, Express.js, React.js, Node.js), enhancing system efficiency by 25% and reducing operational costs by $50K annually."
                            },
                            {
                                "from": "Worked on backend APIs using Node.js.",
                                "to": "Engineered and optimized high-performance REST APIs with Node.js and Express.js, processing over 10,000 requests per minute and improving data retrieval speed by 30% for critical user-facing features."
                            },
                            {
                                "from": "Implemented user interfaces with React.",
                                "to": "Spearheaded the implementation of intuitive, user-centric web interfaces using React.js, which increased user engagement by 15% and boosted conversion rates by 8% through enhanced UX."
                            },
                            {
                                "from": "Collaborated with team members on various projects.",
                                "to": "Collaborated effectively with cross-functional teams of 5-7 developers and designers, applying Agile methodologies to deliver high-quality software solutions 10% faster than projected deadlines."
                            },
                            {
                                "from": "Improved website performance.",
                                "to": "Optimized full-stack web application performance, decreasing page load times by 30% and improving overall system responsiveness, directly supporting a more scalable user experience."
                            }
                        ],
                        "technologies": [
                            "Node.js (v16+)",
                            "Express.js",
                            "React.js (v17+)",
                            "MongoDB (Atlas)",
                            "JavaScript (ES6+)",
                            "HTML5",
                            "CSS3",
                            "Git",
                            "REST APIs"
                        ]
                    },
                    {
                        "type": "job",
                        "title": "Junior Web Developer",
                        "company": "Web Innovations Co.",
                        "url": "https://webinnovations.com",
                        "location": "San Francisco, CA",
                        "dates": {
                            "start": "Jul 2019",
                            "end": "Dec 2020",
                            "is_current": false
                        },
                        "achievements": [
                            {
                                "from": "Assisted in front-end development.",
                                "to": "Supported front-end development initiatives, contributing to responsive and user-centric web applications and resolving over 50 UI-related tickets."
                            },
                            {
                                "from": "Learned new technologies quickly.",
                                "to": "Quickly adopted modern web development practices, including initial exposure to Node.js and React.js, accelerating personal productivity by 20% within the first 3 months."
                            },
                            {
                                "from": "Contributed to small projects.",
                                "to": "Contributed to multiple small-scale web projects, gaining foundational experience in full-stack development principles and collaborative coding practices."
                            }
                        ],
                        "technologies": [
                            "HTML5",
                            "CSS3",
                            "JavaScript",
                            "jQuery",
                            "Git"
                        ]
                    }
                ]
            },
            "education": {
                "section_title": "Education",
                "items": [
                    {
                        "degree": "Bachelor of Science in Computer Science",
                        "institution": "State University",
                        "url": "https://stateu.edu",
                        "location": "State College, PA",
                        "dates": {
                            "start": "Sep 2015",
                            "end": "May 2019"
                        },
                        "gpa": "3.8/4.0",
                        "honors": [
                            "Dean's List (all semesters)"
                        ]
                    }
                ]
            },
            "skills": {
                "section_title": "Skills",
                "categories": [
                    {
                        "name": {
                            "from": "Programming Languages",
                            "to": "Programming Languages & Core Technologies"
                        },
                        "items": [
                            {
                                "from": "JavaScript",
                                "to": "JavaScript (ES6+)"
                            },
                            {
                                "from": "Python",
                                "to": ""
                            },
                            {
                                "from": "Java",
                                "to": ""
                            }
                        ],
                        "description": {
                            "from": "Short description based on data",
                            "to": ""
                        },
                        "proficiency": {
                            "from": "expert",
                            "to": "Expert"
                        }
                    },
                    {
                        "name": {
                            "from": "Frameworks",
                            "to": "MERN Stack & Web Development Frameworks"
                        },
                        "items": [
                            {
                                "from": "React",
                                "to": "React.js (v17+)"
                            },
                            {
                                "from": "Node.js",
                                "to": "Node.js (v16+)"
                            },
                            {
                                "from": "Express.js",
                                "to": "Express.js"
                            }
                        ],
                        "description": {
                            "from": "Short description based on data",
                            "to": ""
                        },
                        "proficiency": {
                            "from": "advanced",
                            "to": "Expert"
                        }
                    },
                    {
                        "name": {
                            "from": "Databases",
                            "to": "Databases"
                        },
                        "items": [
                            {
                                "from": "MongoDB",
                                "to": "MongoDB (Atlas, Mongoose)"
                            },
                            {
                                "from": "MySQL",
                                "to": ""
                            }
                        ],
                        "description": {
                            "from": "Short description based on data",
                            "to": ""
                        },
                        "proficiency": {
                            "from": "intermediate",
                            "to": "Advanced"
                        }
                    },
                    {
                        "name": {
                            "from": "Tools",
                            "to": "Development Tools & Methodologies"
                        },
                        "items": [
                            {
                                "from": "Git",
                                "to": "Git / GitHub"
                            },
                            {
                                "from": "VS Code",
                                "to": "VS Code"
                            }
                        ],
                        "description": {
                            "from": "Short description based on data",
                            "to": ""
                        },
                        "proficiency": {
                            "from": "expert",
                            "to": "Expert"
                        }
                    },
                    {
                        "name": {
                            "from": "Other Skills",
                            "to": "Key Competencies"
                        },
                        "items": [
                            {
                                "from": "API Development",
                                "to": "REST API Development"
                            },
                            {
                                "from": "Problem Solving",
                                "to": "Complex Problem Solving"
                            },
                            {
                                "from": "Teamwork",
                                "to": "Cross-functional Team Collaboration"
                            },
                            {
                                "from": null,
                                "to": "Full-Stack Web Development"
                            },
                            {
                                "from": null,
                                "to": "Scalable Architecture Design"
                            },
                            {
                                "from": null,
                                "to": "User-Centric Design"
                            },
                            {
                                "from": null,
                                "to": "Clean, Maintainable Code"
                            },
                            {
                                "from": null,
                                "to": "Agile Methodologies (Scrum)"
                            },
                            {
                                "from": null,
                                "to": "Modern Web Development"
                            }
                        ],
                        "description": {
                            "from": "Short description based on data",
                            "to": ""
                        },
                        "proficiency": {
                            "from": "advanced",
                            "to": "Expert"
                        }
                    }
                ]
            },
            "projects": {
                "section_title": {
                    "from": "Projects",
                    "to": "Key MERN Stack Projects"
                },
                "items": [
                    {
                        "title": {
                            "from": "E-commerce Platform",
                            "to": "Scalable MERN Stack E-commerce Platform"
                        },
                        "url": {
                            "from": "https://github.com/janedoe/ecommerce",
                            "to": "https://github.com/janedoe/ecommerce"
                        },
                        "description": {
                            "from": "Developed a full-stack e-commerce platform.",
                            "to": "Engineered a robust and scalable full-stack e-commerce platform using the MERN Stack, featuring user authentication, product catalog management, and secure payment integration. This project demonstrates expertise in building user-centric web applications and complex REST APIs."
                        },
                        "dates": {
                            "start": {
                                "from": "March 2022",
                                "to": "Mar 2022"
                            },
                            "end": {
                                "from": "June 2022",
                                "to": "Jun 2022"
                            }
                        },
                        "technologies": [
                            {
                                "from": "MongoDB",
                                "to": "MongoDB"
                            },
                            {
                                "from": "Express",
                                "to": "Express.js"
                            },
                            {
                                "from": "React",
                                "to": "React.js"
                            },
                            {
                                "from": "Node.js",
                                "to": "Node.js"
                            }
                        ],
                        "key_contributions": [
                            {
                                "from": "Designed database schema.",
                                "to": "Designed and optimized MongoDB database schemas for product inventory and user profiles, reducing data retrieval times by 20% and supporting efficient data management for scalable operations."
                            },
                            {
                                "from": "Built REST APIs.",
                                "to": "Developed comprehensive and secure REST APIs using Node.js and Express.js, facilitating seamless communication between front-end and backend components and ensuring efficient data flow."
                            },
                            {
                                "from": "Created user interface.",
                                "to": "Created an intuitive and user-centric front-end interface with React.js, improving user experience and driving a 10% increase in product page views through interactive components."
                            }
                        ]
                    }
                ]
            },
            "certifications": {
                "section_title": "Certifications",
                "items": []
            },
            "courses": {
                "section_title": "Courses",
                "items": []
            },
            "languages": {
                "section_title": "Languages",
                "items": [
                    {
                        "name": "English",
                        "proficiency": {
                            "from": "Native",
                            "to": ""
                        }
                    }
                ]
            },
            "volunteer": {
                "section_title": "Volunteer Experience",
                "items": []
            },
            "achievements": {
                "section_title": "Awards & Achievements",
                "items": []
            },
            "publications": {
                "section_title": "Publications",
                "items": []
            },
            "interests": {
                "section_title": "Interests",
                "items": [
                    {
                        "from": "Hiking",
                        "to": ""
                    },
                    {
                        "from": "Photography",
                        "to": ""
                    }
                ]
            },
            "references": {
                "section_title": "References",
                "items": []
            },
            "patents": {
                "section_title": "Patents",
                "items": []
            },
            "research": {
                "section_title": "Research",
                "items": []
            },
            "custom": {
                "section_title": "Custom Section",
                "items": []
            }
        },
        "job_match_assessment": {
            "job_match_percentage": "92%",
            "improvement_recommendations": "Apply! Your resume is highly optimized for this MERN Stack Software Engineer position. All key requirements, including 2+ years of MERN stack experience, strong understanding of REST APIs, ability to write clean code, and experience collaborating with cross-functional teams, are well-addressed with quantifiable achievements and relevant keywords. The ATS optimization is excellent."
        },
        "apply": true,
        "rendering_rules": {
            "date_format": "MMM YYYY",
            "hide_empty_sections": true,
            "max_items_per_section": "No limit for now",
            "truncate_descriptions_at": 600
        }
    }
}


function convertCVTemplate(apiResponse) {
    // Helper function to deep clone an object
    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }

    // Helper function to process any object and extract "from" or "to" values
    function processObject(obj, type) {
        if (obj === null || typeof obj !== 'object') return obj;

        if (obj instanceof Array) {
            return obj.map(item => processObject(item, type)).filter(item => item !== null);
        }

        const result = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];

                // Check if this is a from/to object
                if (value && typeof value === 'object' && value.hasOwnProperty('from') && value.hasOwnProperty('to')) {
                    const selectedValue = value[type];
                    // Only include if the value exists and is not empty
                    if (selectedValue !== null && selectedValue !== undefined && selectedValue !== '') {
                        result[key] = selectedValue;
                    }
                }
                // Check if this is an array of from/to objects
                else if (value && typeof value === 'object' && value instanceof Array) {
                    const processedArray = value.map(item => {
                        if (item && typeof item === 'object' && item.hasOwnProperty('from') && item.hasOwnProperty('to')) {
                            const selectedValue = item[type];
                            return (selectedValue !== null && selectedValue !== undefined && selectedValue !== '') ? selectedValue : null;
                        }
                        return processObject(item, type);
                    }).filter(item => item !== null);

                    if (processedArray.length > 0) {
                        result[key] = processedArray;
                    }
                }
                // Recursively process nested objects
                else if (value && typeof value === 'object') {
                    const processedValue = processObject(value, type);
                    if (processedValue && Object.keys(processedValue).length > 0) {
                        result[key] = processedValue;
                    }
                }
                // Keep regular values as they are
                else {
                    result[key] = value;
                }
            }
        }

        return result;
    }

    // Helper function to clean empty sections
    function cleanEmptyValues(obj) {
        if (obj === null || typeof obj !== 'object') return obj;

        if (obj instanceof Array) {
            return obj.filter(item => {
                if (item === null || item === undefined || item === '') return false;
                if (typeof item === 'object') {
                    const cleaned = cleanEmptyValues(item);
                    return cleaned && Object.keys(cleaned).length > 0;
                }
                return true;
            });
        }

        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (value === null || value === undefined || value === '') continue;

                if (typeof value === 'object') {
                    const cleanedValue = cleanEmptyValues(value);
                    if (cleanedValue && (!(cleanedValue instanceof Array) || cleanedValue.length > 0) &&
                        (cleanedValue instanceof Array || Object.keys(cleanedValue).length > 0)) {
                        result[key] = cleanedValue;
                    }
                } else {
                    result[key] = value;
                }
            }
        }

        return result;
    }

    // Create base template structure
    const baseTemplate = deepClone(apiResponse.cv_template);

    // Process for "from" template
    const fromTemplate = processObject(baseTemplate, 'from');
    const cleanedFromTemplate = cleanEmptyValues(fromTemplate);

    // Process for "to" template  
    const toTemplate = processObject(baseTemplate, 'to');
    const cleanedToTemplate = cleanEmptyValues(toTemplate);

    return {
        from: {
            cv_template: cleanedFromTemplate,

        },
        to: {
            cv_template: cleanedToTemplate,
        },
        job_match_assessment: apiResponse.cv_template.job_match_assessment,
        apply: apiResponse.cv_template.apply,
        rendering_rules: apiResponse.cv_template.rendering_rules
    };
}

const PdfData = {
    "from": {
        "cv_template": {
            "metadata": {
                "section_order": [
                    "header",
                    "summary",
                    "experience",
                    "skills",
                    "projects",
                    "education",
                    "certifications"
                ]
            },
            "sections": {
                "header": {
                    "name": "John Doe",
                    "title": "Software Developer",
                    "contact_info": {
                        "email": {
                            "value": "john.doe@email.com",
                            "link": "mailto:john.doe@email.com"
                        },
                        "phone": {
                            "value": "123-456-7890",
                            "link": "tel:123-456-7890"
                        },
                        "portfolio": {
                            "value": "johndoe-portfolio.com",
                            "link": "https://johndoe-portfolio.com"
                        },
                        "linkedin": {
                            "value": "linkedin.com/in/johndoe-dev",
                            "link": "https://linkedin.com/in/johndoe-dev"
                        },
                        "location": {
                            "value": "San Francisco, CA"
                        }
                    }
                },
                "summary": {
                    "section_title": "Summary",
                    "content": "Experienced software developer looking for new opportunities. Skilled in JavaScript and web development."
                },
                "experience": {
                    "section_title": "Professional Experience",
                    "items": [
                        {
                            "type": "job",
                            "title": "Full Stack Developer",
                            "company": "Innovatech Solutions",
                            "url": "https://innovatech.com",
                            "location": "San Francisco, CA",
                            "dates": {
                                "start": "Aug 2021",
                                "end": "Present",
                                "is_current": true
                            },
                            "achievements": [
                                "Developed web application features.",
                                "Worked with a team to build the backend.",
                                "Fixed bugs and maintained the codebase.",
                                "Built new services."
                            ],
                            "technologies": [
                                "MongoDB",
                                "Express.js",
                                "React.js",
                                "Node.js",
                                "REST APIs",
                                "JavaScript",
                                "Docker",
                                "Jest",
                                "Agile"
                            ]
                        },
                        {
                            "type": "job",
                            "title": "Junior Developer",
                            "company": "Web Creations LLC",
                            "url": "https://webcreations.com",
                            "location": "Austin, TX",
                            "dates": {
                                "start": "Jun 2019",
                                "end": "Jul 2021",
                                "is_current": false
                            },
                            "achievements": [
                                "Helped build websites.",
                                "Learned about backend development."
                            ],
                            "technologies": [
                                "JavaScript",
                                "React.js",
                                "Node.js",
                                "HTML5",
                                "CSS3",
                                "Git"
                            ]
                        }
                    ]
                },
                "education": {
                    "section_title": "Education",
                    "items": [
                        {
                            "degree": "Bachelor of Science in Computer Science",
                            "institution": "University of Technology",
                            "url": "https://universityoftech.edu",
                            "location": "Austin, TX",
                            "dates": {
                                "start": "Sep 2015",
                                "end": "May 2019"
                            },
                            "gpa": "3.8/4.0",
                            "honors": [
                                "Magna Cum Laude"
                            ]
                        }
                    ]
                },
                "skills": {
                    "section_title": "Technical Skills",
                    "categories": [
                        {
                            "name": "Core Technologies",
                            "items": [
                                "MongoDB",
                                "Express",
                                "React",
                                "Node",
                                "JavaScript",
                                "API"
                            ],
                            "description": "MERN Stack and related web technologies.",
                            "proficiency": "expert"
                        },
                        {
                            "name": "Tools & Methodologies",
                            "items": [
                                "Git",
                                "Docker",
                                "Agile",
                                "Testing",
                                "CI/CD"
                            ],
                            "proficiency": "intermediate"
                        },
                        {
                            "name": "Soft Skills",
                            "items": [
                                "Teamwork",
                                "Problem-solving",
                                "Code Quality"
                            ]
                        }
                    ]
                },
                "projects": {
                    "section_title": "Projects",
                    "items": [
                        {
                            "title": "E-commerce Site",
                            "url": "github.com/johndoe/ecom",
                            "description": "A personal project to build an online store. Built the front-end and back-end.",
                            "technologies": [
                                "React",
                                "Node",
                                "MongoDB",
                                "Express",
                                "JWT"
                            ]
                        }
                    ]
                },
                "certifications": {
                    "section_title": "Certifications",
                    "items": [
                        {
                            "title": "MongoDB Certified Developer, Associate Level",
                            "institution": "MongoDB University",
                            "url": "https://university.mongodb.com/certification",
                            "date": {
                                "start": "",
                                "end": "Oct 2022"
                            },
                            "id": "MDBA-12345-67890"
                        }
                    ]
                },
                "courses": {
                    "section_title": "Courses"
                },
                "languages": {
                    "section_title": "Languages"
                },
                "volunteer": {
                    "section_title": "Volunteer Experience"
                },
                "achievements": {
                    "section_title": "Awards & Achievements"
                },
                "publications": {
                    "section_title": "Publications"
                },
                "interests": {
                    "section_title": "Interests"
                },
                "references": {
                    "section_title": "References"
                },
                "patents": {
                    "section_title": "Patents"
                },
                "research": {
                    "section_title": "Research"
                },
                "custom": {
                    "section_title": "Custom Section"
                }
            },
            "job_match_assessment": {
                "job_match_percentage": "95%",
                "improvement_recommendations": "Your CV is an excellent match for the MERN Stack Software Engineer role. It strongly emphasizes your 2+ years of experience with MongoDB, Express.js, React.js, and Node.js. The summary and experience sections are heavily optimized with keywords from the job description like 'full-stack web applications', 'scalable', 'user-centric', 'REST APIs', and 'clean, maintainable code'. Achievements are quantified and led by strong action verbs. You are ready to apply.",
                "apply": true
            },
            "rendering_rules": {
                "date_format": "MMM YYYY",
                "hide_empty_sections": true,
                "max_items_per_section": "No limit for now",
                "truncate_descriptions_at": 600
            }
        }
    },
    "to": {
        "cv_template": {
            "metadata": {
                "section_order": [
                    "header",
                    "summary",
                    "experience",
                    "skills",
                    "projects",
                    "education",
                    "certifications"
                ]
            },
            "sections": {
                "header": {
                    "name": "John Doe",
                    "title": "MERN Stack Software Engineer",
                    "contact_info": {
                        "email": {
                            "value": "john.doe@email.com",
                            "link": "mailto:john.doe@email.com"
                        },
                        "phone": {
                            "value": "123-456-7890",
                            "link": "tel:123-456-7890"
                        },
                        "portfolio": {
                            "value": "johndoe-portfolio.com",
                            "link": "https://johndoe-portfolio.com"
                        },
                        "linkedin": {
                            "value": "linkedin.com/in/johndoe-dev",
                            "link": "https://linkedin.com/in/johndoe-dev"
                        },
                        "location": {
                            "value": "San Francisco, CA"
                        }
                    }
                },
                "summary": {
                    "section_title": "Summary",
                    "content": "Results-driven MERN Stack Software Engineer with 4+ years of experience developing and maintaining fast, scalable, and user-centric full-stack web applications. Proven ability to write clean, efficient code using MongoDB, Express.js, React.js, and Node.js. Eager to leverage a strong understanding of REST APIs and modern web development to solve real-world problems and contribute to a dynamic team."
                },
                "experience": {
                    "section_title": "Professional Experience",
                    "items": [
                        {
                            "type": "job",
                            "title": "Full Stack Software Engineer",
                            "company": "Innovatech Solutions",
                            "url": "https://innovatech.com",
                            "location": "San Francisco, CA",
                            "dates": {
                                "start": "Aug 2021",
                                "end": "Present",
                                "is_current": true
                            },
                            "achievements": [
                                "Developed and maintained 5+ key features for a high-traffic, full-stack web application using the MERN stack (MongoDB, Express.js, React.js, Node.js), leading to a 20% increase in user retention.",
                                "Collaborated with a cross-functional team of 10 to design and implement robust REST APIs, which improved data retrieval speeds by 30% and supported new user-centric frontend features.",
                                "Wrote clean, maintainable, and efficient Javascript code, achieving 95% unit test coverage with Jest and reducing critical bugs in production by 40%.",
                                "Architected a scalable microservices-based backend with Node.js and Express.js, which handled a 50% increase in traffic and reduced server costs by 15%."
                            ],
                            "technologies": [
                                "MongoDB",
                                "Express.js",
                                "React.js",
                                "Node.js",
                                "REST APIs",
                                "JavaScript",
                                "Docker",
                                "Jest",
                                "Agile"
                            ]
                        },
                        {
                            "type": "job",
                            "title": "Junior Software Engineer",
                            "company": "Web Creations LLC",
                            "url": "https://webcreations.com",
                            "location": "Austin, TX",
                            "dates": {
                                "start": "Jun 2019",
                                "end": "Jul 2021",
                                "is_current": false
                            },
                            "achievements": [
                                "Contributed to the development of a user-facing dashboard using React.js, resulting in a 15% improvement in user task completion rates and fostering a user-centric design approach.",
                                "Assisted in building and consuming REST APIs with Node.js and Express.js, gaining foundational experience in modern full-stack web development and server-side logic."
                            ],
                            "technologies": [
                                "JavaScript",
                                "React.js",
                                "Node.js",
                                "HTML5",
                                "CSS3",
                                "Git"
                            ]
                        }
                    ]
                },
                "education": {
                    "section_title": "Education",
                    "items": [
                        {
                            "degree": "Bachelor of Science in Computer Science",
                            "institution": "University of Technology",
                            "url": "https://universityoftech.edu",
                            "location": "Austin, TX",
                            "dates": {
                                "start": "Sep 2015",
                                "end": "May 2019"
                            },
                            "gpa": "3.8/4.0",
                            "honors": [
                                "Magna Cum Laude"
                            ]
                        }
                    ]
                },
                "skills": {
                    "section_title": "Technical Skills",
                    "categories": [
                        {
                            "name": "MERN Stack & Full-Stack Development",
                            "items": [
                                "MongoDB & Mongoose",
                                "Express.js",
                                "React.js (Context API, Hooks, Redux)",
                                "Node.js",
                                "JavaScript (ES6+)",
                                "REST API Design & Development"
                            ]
                        },
                        {
                            "name": "DevOps, Tooling & Methodologies",
                            "items": [
                                "Git & GitHub",
                                "Docker",
                                "Agile & Scrum",
                                "Jest, React Testing Library",
                                "CI/CD (Jenkins, GitHub Actions)"
                            ]
                        },
                        {
                            "items": [
                                "Cross-Functional Collaboration",
                                "Complex Problem-Solving",
                                "Clean & Maintainable Code"
                            ]
                        }
                    ]
                },
                "projects": {
                    "section_title": "Key MERN Stack Projects",
                    "items": [
                        {
                            "title": "ShopSphere - Full-Stack E-commerce Platform (MERN Stack)",
                            "description": "Spearheaded the end-to-end development of a scalable, user-centric e-commerce platform. Implemented a full-stack MERN architecture, featuring secure user authentication with JWT, a dynamic product catalog managed in MongoDB, and a seamless checkout process. This project showcases proficiency in building fast and innovative full-stack web applications.",
                            "dates": {
                                "start": "Jan 2023",
                                "end": "May 2023"
                            },
                            "technologies": [
                                "React.js",
                                "Node.js",
                                "MongoDB",
                                "Express.js",
                                "REST APIs"
                            ]
                        }
                    ]
                },
                "certifications": {
                    "section_title": "Certifications",
                    "items": [
                        {
                            "title": "MongoDB Certified Developer, Associate Level",
                            "institution": "MongoDB University",
                            "url": "https://university.mongodb.com/certification",
                            "date": {
                                "start": "",
                                "end": "Oct 2022"
                            },
                            "id": "MDBA-12345-67890"
                        }
                    ]
                },
                "courses": {
                    "section_title": "Courses"
                },
                "languages": {
                    "section_title": "Languages"
                },
                "volunteer": {
                    "section_title": "Volunteer Experience"
                },
                "achievements": {
                    "section_title": "Awards & Achievements"
                },
                "publications": {
                    "section_title": "Publications"
                },
                "interests": {
                    "section_title": "Interests"
                },
                "references": {
                    "section_title": "References"
                },
                "patents": {
                    "section_title": "Patents"
                },
                "research": {
                    "section_title": "Research"
                },
                "custom": {
                    "section_title": "Custom Section"
                }
            },
            "job_match_assessment": {
                "job_match_percentage": "95%",
                "improvement_recommendations": "Your CV is an excellent match for the MERN Stack Software Engineer role. It strongly emphasizes your 2+ years of experience with MongoDB, Express.js, React.js, and Node.js. The summary and experience sections are heavily optimized with keywords from the job description like 'full-stack web applications', 'scalable', 'user-centric', 'REST APIs', and 'clean, maintainable code'. Achievements are quantified and led by strong action verbs. You are ready to apply.",
                "apply": true
            },
            "rendering_rules": {
                "date_format": "MMM YYYY",
                "hide_empty_sections": true,
                "max_items_per_section": "No limit for now",
                "truncate_descriptions_at": 600
            }
        }
    },
    "job_match_assessment": {
        "job_match_percentage": "95%",
        "improvement_recommendations": "Your CV is an excellent match for the MERN Stack Software Engineer role. It strongly emphasizes your 2+ years of experience with MongoDB, Express.js, React.js, and Node.js. The summary and experience sections are heavily optimized with keywords from the job description like 'full-stack web applications', 'scalable', 'user-centric', 'REST APIs', and 'clean, maintainable code'. Achievements are quantified and led by strong action verbs. You are ready to apply.",
        "apply": true
    },
    "rendering_rules": {
        "date_format": "MMM YYYY",
        "hide_empty_sections": true,
        "max_items_per_section": "No limit for now",
        "truncate_descriptions_at": 600
    }
}



export const convertLatexToJson = async (req, res) => {

    try {
        const { pdfUrl, jobTitle, jobDescription, apiKey } = req.body;
        const { extractedData } = await extractPdfData(pdfUrl);
        const prompt = getConversionPrompt(jobTitle, jobDescription, extractedData, CV_STRUCTURE_WITH_CHANGES);
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
        const result = await model.generateContent(prompt);
        const json = result.response.text();
        const parsedData = parseJson(json);
        const parsedData2 = convertCVTemplate(parsedData);

        console.log("Converting to pdf");
        const formattedLatexTo = generateCVLatexTemplate2_new(parsedData2.to);
        const formattedLatexFrom = generateCVLatexTemplate2_new(parsedData2.from);
        const pdfto = await convertJsonTexToPdfLocally(formattedLatexTo);
        const pdffrom = await convertJsonTexToPdfLocally(formattedLatexFrom);


        res.json({
            to: {
                pdfUrl: pdfto.pdfUrl,
                pdfName: pdfto.pdfName,
                publicId: pdfto.publicId
            },
            from: {
                pdfUrl: pdffrom.pdfUrl,
                pdfName: pdffrom.pdfName,
                publicId: pdffrom.publicId
            }
        });


    } catch (error) {
        console.error("Error in convertLatexToJson:", error);
        return res.status(500).json({ error: "Internal Server Error" });

    }
}
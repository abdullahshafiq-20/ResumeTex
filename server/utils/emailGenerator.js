/**
 * Generates a professional email template based on job and candidate information
 * @param {Object} params - The parameters for email generation
 * @param {string} params.jobTitle - The title of the job
 * @param {string} params.jobDescription - Description of the job
 * @param {string} params.summary - Summary/bio of the candidate
 * @param {Array<string>} params.skills - Array of candidate's skills
 * @param {Array<string>} params.projects - Array of candidate's projects
 * @param {string} [params.candidateName="Candidate"] - Name of the candidate
 * @param {string} [params.companyName="Company"] - Name of the company
 * @param {string} [params.recruiterName="Hiring Manager"] - Name of the recruiter
 * @param {boolean} [params.extractSummary=true] - Whether to extract key points from summary
 * @returns {Object} Email template in JSON format with subject and body
 */

function extractKeywords(text) {
    const stopwords = ['the', 'and', 'with', 'for', 'to', 'of', 'in', 'on', 'a', 'an', 'is', 'are', 'as', 'by', 'at', 'from', 'that', 'this', 'we', 'our', 'you', 'your'];
    return Array.from(new Set(
        text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(word => word && !stopwords.includes(word))
    ));
}

/**
 * Email template definitions with different styles
 */
const EMAIL_TEMPLATES = {
    PROFESSIONAL: {
        name: "Professional & Formal",
        subjectTemplates: {
            withCompany: [
                "${candidateName} - Application for ${jobTitle} Position at ${companyName}",
                "Professional ${jobTitle} Candidate - ${candidateName}",
                "${candidateName} - Experienced ${jobTitle} Professional",
                "Application for ${jobTitle} Role - ${candidateName}"
            ],
            withoutCompany: [
                "${candidateName} - Qualified ${jobTitle} Candidate",
                "Professional Application for ${jobTitle}",
                "${candidateName} - ${jobTitle} Professional"
            ]
        },
        openings: {
            withCompany: [
                "I hope this email finds you well. I am writing to express my sincere interest in the ${jobTitle} position at ${companyName}.",
                "I am writing to formally apply for the ${jobTitle} position at ${companyName}.",
                "I would like to submit my application for the ${jobTitle} role at ${companyName}."
            ],
            withoutCompany: [
                "I hope this email finds you well. I am writing to express my interest in the ${jobTitle} position.",
                "I am writing to formally apply for the ${jobTitle} position.",
                "I would like to submit my application for the ${jobTitle} role."
            ]
        },
        closings: {
            withCompany: [
                "I would welcome the opportunity to discuss how my background and skills would benefit ${companyName}. Thank you for considering my application.",
                "I am eager to contribute to ${companyName}'s continued success and would appreciate the opportunity to discuss my qualifications further.",
                "I look forward to the possibility of joining the ${companyName} team and contributing to your organization's goals."
            ],
            withoutCompany: [
                "I would welcome the opportunity to discuss how my background and skills would benefit your organization. Thank you for considering my application.",
                "I am eager to contribute to your team's success and would appreciate the opportunity to discuss my qualifications further.",
                "I look forward to the possibility of joining your team and contributing to your organization's goals."
            ]
        }
    },

    ENTHUSIASTIC: {
        name: "Enthusiastic & Energetic",
        subjectTemplates: {
            withCompany: [
                "Excited to Apply: ${jobTitle} at ${companyName} - ${candidateName}",
                "${candidateName} - Passionate ${jobTitle} Ready to Join ${companyName}!",
                "Your Next ${jobTitle} is Here - ${candidateName}"
            ],
            withoutCompany: [
                "Excited ${jobTitle} Candidate - ${candidateName}",
                "Passionate ${jobTitle} Professional - ${candidateName}",
                "Your Next ${jobTitle} is Here!"
            ]
        },
        openings: {
            withCompany: [
                "I'm thrilled to apply for the ${jobTitle} position at ${companyName}!",
                "I couldn't be more excited about the opportunity to join ${companyName} as a ${jobTitle}!",
                "I'm genuinely excited about the ${jobTitle} role at ${companyName} and would love to be part of your team!"
            ],
            withoutCompany: [
                "I'm thrilled to apply for the ${jobTitle} position!",
                "I couldn't be more excited about the opportunity to work as a ${jobTitle}!",
                "I'm genuinely excited about the ${jobTitle} role and would love to be part of your team!"
            ]
        },
        closings: {
            withCompany: [
                "I'm excited about the possibility of bringing my passion and expertise to ${companyName}. Let's discuss how I can contribute to your team's success!",
                "I can't wait to potentially join ${companyName} and make a meaningful impact. I'd love to chat about this opportunity!",
                "I'm enthusiastic about the opportunity to grow with ${companyName} and would be thrilled to discuss my fit for this role!"
            ],
            withoutCompany: [
                "I'm excited about the possibility of bringing my passion and expertise to your team. Let's discuss how I can contribute to your success!",
                "I can't wait to potentially join your organization and make a meaningful impact. I'd love to chat about this opportunity!",
                "I'm enthusiastic about this opportunity and would be thrilled to discuss my fit for this role!"
            ]
        }
    },

    DIRECT: {
        name: "Direct & Concise",
        subjectTemplates: {
            withCompany: [
                "${jobTitle} Application - ${candidateName}",
                "${candidateName} for ${jobTitle} at ${companyName}",
                "Re: ${jobTitle} Position - ${candidateName}"
            ],
            withoutCompany: [
                "${jobTitle} Application - ${candidateName}",
                "${candidateName} for ${jobTitle}",
                "Re: ${jobTitle} Position"
            ]
        },
        openings: {
            withCompany: [
                "I'm applying for the ${jobTitle} position at ${companyName}.",
                "I'd like to apply for your ${jobTitle} opening at ${companyName}.",
                "I'm interested in the ${jobTitle} role at ${companyName}."
            ],
            withoutCompany: [
                "I'm applying for the ${jobTitle} position.",
                "I'd like to apply for your ${jobTitle} opening.",
                "I'm interested in the ${jobTitle} role."
            ]
        },
        closings: {
            withCompany: [
                "I believe I'm a strong fit for this role at ${companyName}. Let's schedule a conversation.",
                "I'm confident I can add value to ${companyName}. I'm available to discuss this opportunity.",
                "I'd like to discuss how I can contribute to ${companyName}'s success."
            ],
            withoutCompany: [
                "I believe I'm a strong fit for this role. Let's schedule a conversation.",
                "I'm confident I can add value to your team. I'm available to discuss this opportunity.",
                "I'd like to discuss how I can contribute to your organization's success."
            ]
        }
    },

    STORY_TELLING: {
        name: "Story-telling & Personal",
        subjectTemplates: {
            withCompany: [
                "${candidateName}'s Journey to ${companyName} - ${jobTitle} Application",
                "Why I'm Perfect for ${jobTitle} at ${companyName} - ${candidateName}",
                "${candidateName} - Your Next ${jobTitle} Story Begins Here"
            ],
            withoutCompany: [
                "${candidateName}'s Professional Journey - ${jobTitle} Application",
                "Why I'm Perfect for Your ${jobTitle} Role - ${candidateName}",
                "${candidateName} - Your Next ${jobTitle} Story"
            ]
        },
        openings: {
            withCompany: [
                "Throughout my career, I've been searching for an opportunity that combines my passion for technology with meaningful impact. The ${jobTitle} position at ${companyName} represents exactly that opportunity.",
                "My journey as a professional has led me to this moment - applying for the ${jobTitle} role at ${companyName}, where I believe I can make my greatest contribution yet.",
                "Every project I've worked on has prepared me for this next step: joining ${companyName} as a ${jobTitle}."
            ],
            withoutCompany: [
                "Throughout my career, I've been searching for an opportunity that combines my passion for technology with meaningful impact. The ${jobTitle} position represents exactly that opportunity.",
                "My journey as a professional has led me to this moment - applying for the ${jobTitle} role where I believe I can make my greatest contribution yet.",
                "Every project I've worked on has prepared me for this next step: taking on the ${jobTitle} role."
            ]
        },
        closings: {
            withCompany: [
                "I see this role at ${companyName} as the next chapter in my professional story - one where I can grow while contributing to something meaningful. I'd love to share more about my journey with you.",
                "The opportunity to join ${companyName} represents not just a job, but a chance to be part of something bigger. I'm excited to discuss how my story aligns with your needs.",
                "I believe the best is yet to come, and I'd love that future to include contributing to ${companyName}'s success. Let's start that conversation."
            ],
            withoutCompany: [
                "I see this role as the next chapter in my professional story - one where I can grow while contributing to something meaningful. I'd love to share more about my journey with you.",
                "This opportunity represents not just a job, but a chance to be part of something bigger. I'm excited to discuss how my story aligns with your needs.",
                "I believe the best is yet to come, and I'd love that future to include contributing to your organization's success. Let's start that conversation."
            ]
        }
    },

    ACHIEVEMENT_FOCUSED: {
        name: "Achievement & Results Focused",
        subjectTemplates: {
            withCompany: [
                "Results-Driven ${jobTitle} for ${companyName} - ${candidateName}",
                "${candidateName} - Proven ${jobTitle} with Track Record of Success",
                "High-Impact ${jobTitle} Candidate - ${candidateName}"
            ],
            withoutCompany: [
                "Results-Driven ${jobTitle} - ${candidateName}",
                "${candidateName} - Proven ${jobTitle} Professional",
                "High-Impact ${jobTitle} Candidate"
            ]
        },
        openings: {
            withCompany: [
                "I'm writing to apply for the ${jobTitle} position at ${companyName}, bringing a proven track record of delivering measurable results in similar roles.",
                "With a history of exceeding expectations and driving impact, I'm excited to apply for the ${jobTitle} role at ${companyName}.",
                "I'm applying for the ${jobTitle} position at ${companyName} with confidence in my ability to deliver the results you're seeking."
            ],
            withoutCompany: [
                "I'm writing to apply for the ${jobTitle} position, bringing a proven track record of delivering measurable results in similar roles.",
                "With a history of exceeding expectations and driving impact, I'm excited to apply for the ${jobTitle} role.",
                "I'm applying for the ${jobTitle} position with confidence in my ability to deliver the results you're seeking."
            ]
        },
        closings: {
            withCompany: [
                "I'm confident that my track record of success and results-driven approach would make me a valuable addition to ${companyName}. I'd welcome the opportunity to discuss specific achievements that align with your goals.",
                "My history of delivering measurable impact speaks to my potential contribution to ${companyName}. Let's discuss how I can drive similar results for your team.",
                "I believe results speak louder than words, and I'd love to share specific examples of how I can contribute to ${companyName}'s continued success."
            ],
            withoutCompany: [
                "I'm confident that my track record of success and results-driven approach would make me a valuable addition to your team. I'd welcome the opportunity to discuss specific achievements that align with your goals.",
                "My history of delivering measurable impact speaks to my potential contribution to your organization. Let's discuss how I can drive similar results for your team.",
                "I believe results speak louder than words, and I'd love to share specific examples of how I can contribute to your continued success."
            ]
        }
    }
};

/**
 * Utility function to get random item from array
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Utility function to replace template variables
 */
function replacePlaceholders(template, params) {
    return template
        .replace(/\$\{candidateName\}/g, params.candidateName || 'Candidate')
        .replace(/\$\{companyName\}/g, params.companyName || 'Company')
        .replace(/\$\{jobTitle\}/g, params.jobTitle || 'Position')
        .replace(/\$\{recruiterName\}/g, params.recruiterName || 'Hiring Manager');
}

/**
 * Creates a random email template using one of the predefined styles
 */
export const createRandomEmailTemplate = (params) => {
    // Get random template style
    const templateKeys = Object.keys(EMAIL_TEMPLATES);
    const randomTemplateKey = getRandomItem(templateKeys);
    const selectedTemplate = EMAIL_TEMPLATES[randomTemplateKey];
    
    return createEmailTemplateWithStyle(params, randomTemplateKey);
};

/**
 * Creates an email template using a specific style
 */
export const createEmailTemplateWithStyle = (params, templateStyle = 'PROFESSIONAL') => {
    const {
        to,
        jobTitle,
        jobDescription,
        summary,
        skills = [],
        projects = [],
        candidateName = 'Candidate',
        companyName = '',
        recruiterName = 'Hiring Manager',
        extractSummary = true
    } = params;

    // Validate required parameters
    if (!jobTitle || !jobDescription || !summary) {
        throw new Error("Missing required parameters: jobTitle, jobDescription, and summary are required");
    }

    const template = EMAIL_TEMPLATES[templateStyle] || EMAIL_TEMPLATES.PROFESSIONAL;
    const hasCompany = companyName && companyName.trim() !== '';
    
    // Get random subject line
    const subjectTemplates = hasCompany ? template.subjectTemplates.withCompany : template.subjectTemplates.withoutCompany;
    const subjectLine = replacePlaceholders(getRandomItem(subjectTemplates), params);
    
    // Get random opening
    const openings = hasCompany ? template.openings.withCompany : template.openings.withoutCompany;
    const opening = replacePlaceholders(getRandomItem(openings), params);
    
    // Get random closing
    const closings = hasCompany ? template.closings.withCompany : template.closings.withoutCompany;
    const closing = replacePlaceholders(getRandomItem(closings), params);

    // Process summary and generate email content
    const jobKeywords = extractKeywords(jobDescription);
    const matchedSkills = skills.filter(skill =>
        jobKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    );

    let matchSummary = '';
    if (matchedSkills.length > 0) {
        const matchPhrases = [
            `My experience with ${matchedSkills.join(', ')} directly aligns with your requirements.`,
            `I bring hands-on experience in ${matchedSkills.join(', ')}, which matches perfectly with what you're looking for.`,
            `My proficiency in ${matchedSkills.join(', ')} makes me an ideal candidate for this role.`,
            `I have extensive experience working with ${matchedSkills.join(', ')}, which directly relates to your job requirements.`
        ];
        matchSummary = getRandomItem(matchPhrases) + ' ';
    }

    // Format skills text
    let skillsText = "";
    if (skills.length > 0) {
        if (skills.length === 1) {
            skillsText = skills[0];
        } else if (skills.length === 2) {
            skillsText = `${skills[0]} and ${skills[1]}`;
        } else {
            const lastSkill = skills[skills.length - 1];
            const otherSkills = skills.slice(0, skills.length - 1).join(", ");
            skillsText = `${otherSkills}, and ${lastSkill}`;
        }
    }

    // Format projects section with variations
    let projectsSection = "";
    if (projects.length > 0) {
        const projectIntros = [
            "Key projects in my portfolio include:",
            "Notable projects I've delivered include:",
            "Some highlights from my project experience:",
            "Recent projects that demonstrate my capabilities:"
        ];
        projectsSection = getRandomItem(projectIntros);
        projects.forEach(project => {
            projectsSection += `\n• ${project}`;
        });
    }

    // Process summary
    let processedSummary = summary;
    if (extractSummary) {
        processedSummary = extractKeyPointsFromSummary(summary);
    }

    // Generate skills section with variation
    let skillsSection = "";
    if (skills.length > 0) {
        const skillIntros = [
            `My technical expertise includes ${skillsText}, making me well-suited for this position.`,
            `I bring strong skills in ${skillsText} that directly apply to this role.`,
            `My proficiency in ${skillsText} positions me as a strong candidate for this opportunity.`,
            `With expertise in ${skillsText}, I'm confident I can make an immediate impact.`
        ];
        skillsSection = getRandomItem(skillIntros);
    }

    // Create the email body
    const emailBody = `Dear ${recruiterName},

${opening} ${processedSummary} ${matchSummary}

${skillsSection}

${projectsSection}

${closing}

Best regards,
${candidateName}`;

    return {
        to: to || '',
        subject: subjectLine,
        body: emailBody,
        templateStyle: template.name
    };
};

/**
 * Get list of available template styles
 */
export const getAvailableTemplateStyles = () => {
    return Object.keys(EMAIL_TEMPLATES).map(key => ({
        key,
        name: EMAIL_TEMPLATES[key].name
    }));
};

// Keep the original function for backward compatibility
export const generateEmailTemplate = (params) => {
    
    return createRandomEmailTemplate(params);

};

/**
 * Extracts key points from a candidate summary and formats them for better email presentation
 * @param {string} summary - The candidate's summary paragraph
 * @returns {string} Formatted key points from the summary
 */
function extractKeyPointsFromSummary(summary) {
    if (!summary) return "";
    let count = 0

    // Identify common sections in a professional summary
    const experienceMatch = summary.match(/(\d+\+?\s*years?(?:\s+of)?\s+experience)/i);
    const yearsOfExperience = experienceMatch ? experienceMatch[0] : null;

    // Extract key phrases and roles
    const roles = extractRoles(summary);
    const keyPhrases = extractKeyPhrases(summary);
    const specializations = extractSpecializations(summary);
    const achievements = extractAchievements(summary);

    // Build a structured summary
    let formattedSummary = "As a professional ";

    if (roles.length > 0) {
        formattedSummary += `${roles[0]}`;
    }

    if (yearsOfExperience) {
        formattedSummary += ` with ${yearsOfExperience}`;
    }

    if (specializations.length > 0) {
        if (specializations.length === 1) {
            formattedSummary += `, I specialize in ${specializations[0]}.`;
        } else {
            const lastSpecialization = specializations[specializations.length - 1];
            const otherSpecializations = specializations.slice(0, specializations.length - 1).join(", ");
            formattedSummary += `, I specialize in ${otherSpecializations} and ${lastSpecialization}.`;
        }
    } else {
        formattedSummary += ".";
    }


    // Add achievements if available
    if (achievements.length > 0) {
        formattedSummary += ` I have ${achievements.join(" and ")}.`;
    }

    // Add extra key phrases
    if (keyPhrases.length > 0) {
        formattedSummary += ` ${keyPhrases.join(" ")}`;
    }

    // Clean up any double spaces and periods
    return formattedSummary
        .replace(/\s+/g, " ")
        .replace(/\.\s*\./g, ".")
        .replace(/\,\s*\./g, ".")
        .trim();
}

/**
 * Extracts professional roles from summary
 * @param {string} summary 
 * @returns {string[]} Array of roles
 */
function extractRoles(summary) {
    const commonRoles = [
        "Software Engineer", "Developer", "Full-Stack Developer", "Frontend Developer",
        "Backend Developer", "DevOps Engineer", "Data Scientist", "Project Manager",
        "Product Manager", "UX Designer", "UI Designer", "System Architect",
        "Technical Lead", "Engineering Manager", "QA Engineer", "Database Administrator"
    ];

    const roles = [];
    commonRoles.forEach(role => {
        if (summary.includes(role)) {
            roles.push(role);
        }
    });

    return roles;
}

/**
 * Extracts specializations from summary
 * @param {string} summary 
 * @returns {string[]} Array of specializations
 */
function extractSpecializations(summary) {
    const specializationPatterns = [
        /specializing in\s+([^\.]+)/i,
        /expertise in\s+([^\.]+)/i,
        /focused on\s+([^\.]+)/i,
        /proficient in\s+([^\.]+)/i
    ];

    for (const pattern of specializationPatterns) {
        const match = summary.match(pattern);
        if (match && match[1]) {
            // Split by commas or "and" to get multiple specializations
            return match[1].split(/,|\sand\s/).map(s => s.trim());
        }
    }

    return [];
}

/**
 * Extracts achievements from summary
 * @param {string} summary 
 * @returns {string[]} Array of achievements
 */
function extractAchievements(summary) {
    const achievementPatterns = [
        /proven ability to\s+([^\.]+)/i,
        /successfully\s+([^\.]+)/i,
        /demonstrated\s+([^\.]+)/i,
        /track record of\s+([^\.]+)/i
    ];

    const achievements = [];

    achievementPatterns.forEach(pattern => {
        const match = summary.match(pattern);
        if (match && match[1]) {
            achievements.push(match[0]);
        }
    });

    return achievements;
}

/**
 * Extracts additional key phrases from summary
 * @param {string} summary 
 * @returns {string[]} Array of key phrases
 */
function extractKeyPhrases(summary) {
    const passionPatterns = [
        /passionate about\s+([^\.]+)/i,
        /enthusiastic about\s+([^\.]+)/i,
        /dedicated to\s+([^\.]+)/i
    ];

    const phrases = [];

    passionPatterns.forEach(pattern => {
        const match = summary.match(pattern);
        if (match && match[0]) {
            phrases.push(match[0]);
        }
    });

    return phrases;
}



// // Example usage:
// const emailParams = {
//     jobTitle: "Senior Frontend Developer",
//     jobDescription: "We are looking for an experienced frontend developer with React expertise to join our team.",
//     summary: "I am a frontend developer with 5+ years of experience building responsive web applications using modern JavaScript frameworks.",
//     skills: ["JavaScript", "React", "TypeScript", "CSS3", "Redux"],
//     projects: ["E-commerce Platform", "Healthcare Dashboard"],
//     candidateName: "Alex Johnson",
//     companyName: "TechCorp",
//     recruiterName: "Sam Smith"
// };

// const emailTemplate = generateEmailTemplate(emailParams);
// console.log(JSON.stringify(emailTemplate, null, 2));
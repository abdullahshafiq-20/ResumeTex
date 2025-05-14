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
export const generateEmailTemplate = (params) => {
    // Destructure parameters with defaults
    const {
        to,
        jobTitle,
        jobDescription,
        summary,
        skills = [],
        projects = [],
        candidateName,
        companyName,
        recruiterName,
        extractSummary = true
    } = params;

    let subjectLine, starting_line, middle_sentence, closing_sentence;


    // Validate required parameters
    if (companyName === "") {
        subjectLine = `${candidateName} - Qualified Candidate for ${jobTitle}`;
        starting_line = `I hope this email finds you well. I am writing to express my interest in the ${jobTitle} position.`
        middle_sentence = `I'd welcome the opportunity to discuss how my background and skills would benefit the company. I've attached my resume for your review, and I'm available for an interview at your convenience.`
        closing_sentence = `Thank you for considering my application. I look forward to the possibility of working with your team.`

    }
    else {
        subjectLine = `${candidateName} - Qualified Candidate for ${jobTitle} Position at ${companyName}`;
        starting_line = `I hope this email finds you well. I am writing to express my interest in the ${jobTitle} position at ${companyName}.`
        middle_sentence = `I'd welcome the opportunity to discuss how my background and skills would benefit ${companyName}. I've attached my resume for your review, and I'm available for an interview at your convenience.`
        closing_sentence = `Thank you for considering my application. I look forward to the possibility of working with the ${companyName} team.`
    }
    if (!jobTitle || !jobDescription || !summary) {
        throw new Error("Missing required parameters: jobTitle, jobDescription, and summary are required");
    }

    // Generate a personalized subject line


    const jobKeywords = extractKeywords(jobDescription);

    // Match candidate's skills and projects with job keywords
    const matchedSkills = skills.filter(skill =>
        jobKeywords.some(keyword => skill.toLowerCase().includes(keyword))
    );
    const matchedProjects = projects.filter(project =>
        jobKeywords.some(keyword => project.toLowerCase().includes(keyword))
    );

    // Build a highlighted match summary
    let matchSummary = '';
    if (matchedSkills.length > 0) {
        matchSummary += `My experience with ${matchedSkills.join(', ')} directly matches your requirements. `;
    }


    // Format skills as a comma-separated list with proper grammar
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

    // Format projects section
    let projectsSection = "";
    if (projects.length > 0) {
        projectsSection = "\n\nNotable projects include:";
        projects.forEach(project => {
            projectsSection += `\n- ${project}`;
        });
    }

    // Extract key information from the summary for better email presentation
    let processedSummary = summary;
    if (extractSummary) {
        processedSummary = extractKeyPointsFromSummary(summary);
    }

    // Generate the email body
    console.log("Processed Summary: ", processedSummary);
    const emailBody = `Dear Hiring Manager/Team,
  
    ${starting_line}
  
    ${processedSummary}
  
    ${matchSummary}
  
    Based on the job description, I believe my experience aligns well with what you're looking for. ${skills.length > 0 ? `My proficiency in ${skillsText} makes me a strong candidate for this role.` : ""}${projectsSection}
  
    ${middle_sentence}
  
    ${closing_sentence}
  
    Best regards,
    ${candidateName}`;

    // Return the email template in JSON format
    return {
        to: to,
        subject: subjectLine,
        body: emailBody,
    };
}

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
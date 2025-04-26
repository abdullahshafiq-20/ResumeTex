// emailController.js
import { google } from "googleapis";
import dotenv from "dotenv";
import { User, UserPreferences, Email } from "../../models/userSchema.js";
import { setupOAuthWithRefreshToken } from "../../utils/oauthUtils.js";
import { generateEmailTemplate } from "../../utils/emailGenerator.js";

dotenv.config();

const PROMPT = `
  Using the provided job title and job description, create a professional email template that can be used for outreach or networking purposes. The email should:

  1-Have a clear, professional subject line related to the position
  2-Include a concise introduction that mentions the position
  3-Briefly highlight key qualifications or interest in the role
  4-Request an opportunity to discuss the position further
  5-End with a professional closing

`

// Controller to send email
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware
    
    // Get user from database with tokens
    const user = await User.findById(userId);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    
    // Set up OAuth2 client with user's refresh token
    const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);
    
    // Create Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Encode email content
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${user.email}`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      message
    ];
    const emailContent = messageParts.join('\n');
    
    // Encode the email to base64url format
    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send the email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    
    return res.status(200).json({ success: true, messageId: result.data.id });
  } catch (error) {
    console.error('Send email error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};

// Send an email with attachments
export const sendEmailWithAttachment = async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const attachment = req.file; // Assuming you're using multer for file uploads
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    
    // Set up OAuth2 client with user's refresh token
    const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);
    
    // Create Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Read file if there is an attachment
    let attachmentPart = '';
    if (attachment) {
      const attachmentBase64 = attachment.buffer.toString('base64');
      const boundary = 'foo_bar_baz';
      
      attachmentPart = `
--${boundary}
Content-Type: ${attachment.mimetype}
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${attachment.originalname}"

${attachmentBase64}
--${boundary}--`;
      
      // Start with multipart message
      const messageParts = [
        `From: ${user.email}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${boundary}"`,
        '',
        `--${boundary}`,
        'Content-Type: text/html; charset=utf-8',
        '',
        message,
        attachmentPart
      ];
      
      const emailContent = messageParts.join('\n');
      
      // Encode the email to base64url format
      const encodedMessage = Buffer.from(emailContent)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      // Send the email
      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage
        }
      });
      
      return res.status(200).json({ success: true, messageId: result.data.id });
    } else {
      // Regular email without attachment
      return await sendEmail(req, res);
    }
  } catch (error) {
    console.error('Send email with attachment error:', error);
    return res.status(500).json({ error: 'Failed to send email with attachment', details: error.message });
  }
};

function generateEmailTemplate22(params) {
    // Destructure parameters with defaults
    const {
      jobTitle,
      jobDescription,
      summary,
      skills = [],
      projects = [],
      candidateName = "Candidate",
      companyName = "Company",
      recruiterName = "Hiring Manager"
    } = params;

    // Validate required parameters
    if (!jobTitle || !jobDescription || !summary) {
      throw new Error("Missing required parameters: jobTitle, jobDescription, and summary are required");
    }

    // Generate a personalized subject line
    const subjectLine = `${candidateName} - Qualified Candidate for ${jobTitle} Position at ${companyName}`;

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

    // Generate the email body
    const emailBody = `Dear Hiring Manager,

  I hope this email finds you well. I am writing to express my interest in the ${jobTitle} position at ${companyName}.

  ${summary}

  Based on the job description, I believe my experience aligns well with what you're looking for. ${skills.length > 0 ? `My proficiency in ${skillsText} makes me a strong candidate for this role.` : ""}${projectsSection}

  I'd welcome the opportunity to discuss how my background and skills would benefit ${companyName}. I've attached my resume for your review, and I'm available for an interview at your convenience.

  Thank you for considering my application. I look forward to the possibility of working with the ${companyName} team.

  Best regards,
  ${candidateName}`;

    // Return the email template in JSON format
    return {
      subject: subjectLine,
      body: emailBody
    };
  }

  // Example usage:



export const createEmail = async (req, res) => {
  try {
    // const { jobTitle, jobDescription } = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    const user = await User.findById(userId);
    const userPreferences = await UserPreferences.findOne({ userId: user._id });
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    if (!userPreferences) {
      return res.status(400).json({ error: 'User preferences not found' });
    }

    const emailParams = {
      to: "email@gmail.com",
      jobTitle: "Senior Frontend Developer",
      jobDescription: "We are looking for a passionate and skilled Software Engineer to design, develop, and maintain high-quality software solutions. You will work closely with cross-functional teams to build scalable applications, write clean and efficient code, and solve complex technical challenges across various projects such as developing internal tools, building customer-facing web apps, and optimizing cloud-based systems. A strong foundation in programming languages like JavaScript, Python, or Java, experience with modern frameworks, and a good understanding of databases and cloud technologies are essential. If you thrive in a fast-paced environment, enjoy contributing to impactful projects, and are committed to continuous learning, we'd love to hear from you.",
      summary:userPreferences.summary ||"Highly motivated Software Engineer with over five years of experience in full-stack development. Proficient in designing, implementing, and optimizing scalable web applications. Passionate about problem-solving, automation, and cloud computing. Strong background in software development, database management, and DevOps practices",
      skills: userPreferences.skills || ["React", "JavaScript", "CSS"],
      projects: userPreferences.projects || ["Project A", "Project B"],
      candidateName: user.name || "John Doe",
      companyName: "TechCorp",
      recruiterName: "Sam Smith"
    };

    const email = generateEmailTemplate(emailParams);
    const { to, subject, body} = email;
    res.status(200).json({ to, subject, body});
 
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate email', details: error.message });
    console.error('Error generating email:', error);
  }
}

export const saveEmail = async (req, res) => {
  try {
    const { to, subject, body, attachment} = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Save the email to the database (you need to implement this part)
    const email = new Email({ userId, to, subject, body, attachment });
    await email.save();

    res.status(200).json({ message: 'Email saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save email', details: error.message });
  }
}

export const getEmails = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Fetch emails from the database (you need to implement this part)
    const emails = await Email.find({ userId });

    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails', details: error.message });
  }
}
export const deleteEmail = async (req, res) => {
  try {
    const { emailId } = req.params;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Delete the email from the database (you need to implement this part)
    await Email.findByIdAndDelete({ _id: emailId, userId });

    res.status(200).json({ message: 'Email deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete email', details: error.message });
  }
}
export const updateEmail = async (req, res) => {
  try {
    //dynamic update
    const { emailId } = req.params;
    const updates = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Update the email in the database (you need to implement this part)

    const email = await Email.findByIdAndUpdate({ _id: emailId, userId }, updates, { new: true });
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }

    res.status(200).json({ message: 'Email updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update email', details: error.message });
  }
}

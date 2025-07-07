// emailController.js
import { google } from "googleapis";
import dotenv from "dotenv";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { User, UserPreferences, Email, UserResume } from "../../models/userSchema.js";
import { setupOAuthWithRefreshToken } from "../../utils/oauthUtils.js";
import { generateEmailTemplate } from "../../utils/emailGenerator.js";
import { emitEmailCreated, emitEmailSent, emitStatsDashboard, emitToUser } from "../../config/socketConfig.js";
import { triggerStatsUpdate } from "../../utils/trigger.js";
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
// export const sendEmail = async (req, res) => {
//   try {
//     const { to, subject, message, attachement} = req.body;
//     const userId = req.user.id; // Assuming you have user ID from auth middleware

//     // Get user from database with tokens
//     const user = await User.findById(userId);

//     if (!user || !user.googleRefreshToken) {
//       return res.status(401).json({ error: 'User not authenticated with Google' });
//     }

//     // Set up OAuth2 client with user's refresh token
//     const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);

//     // Create Gmail API client
//     const gmail = google.gmail({ version: 'v1', auth });

//     // Encode email content
//     const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
//     const messageParts = [
//       `From: ${user.email}`,
//       `To: ${to}`,
//       `Subject: ${utf8Subject}`,
//       'MIME-Version: 1.0',
//       'Content-Type: text/html; charset=utf-8',
//       'Content-Transfer-Encoding: 7bit',
//       '',
//       message,
//       attachement ? `Attachement: ${attachement}` : ''
//     ];
//     const emailContent = messageParts.join('\n');

//     // Encode the email to base64url format
//     const encodedMessage = Buffer.from(emailContent)
//       .toString('base64')
//       .replace(/\+/g, '-')
//       .replace(/\//g, '_')
//       .replace(/=+$/, '');

//     // Send the email
//     const result = await gmail.users.messages.send({
//       userId: 'me',
//       requestBody: {
//         raw: encodedMessage
//       }
//     });

//     return res.status(200).json({ success: true, messageId: result.data.id });
//   } catch (error) {
//     console.error('Send email error:', error);
//     return res.status(500).json({ error: 'Failed to send email', details: error.message });
//   }
// };
export const sendEmail = async (req, res) => {
  try {
    // Check both spellings to handle potential mismatch
    const { to, subject, message, attachment, attachement } = req.body;
    const pdfUrl = attachment || attachement; // Handle both spellings
    const userId = req.user.id;

    // //console.log('Email request received:', { to, subject, hasAttachment: !!pdfUrl });

    // Get user from database with tokens
    const user = await User.findById(userId);

    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }

    // Set up OAuth2 client with user's refresh token
    const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);

    // Create Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });

    // Generate a boundary string for multipart message
    const boundary = `boundary-${uuidv4()}`;

    // Encode email content
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

    // Start with email headers
    let messageParts = [
      `From: ${user.email}`,
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary=${boundary}`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      message,
      ''
    ];

    // Add attachment if provided
    if (pdfUrl) {
      try {
        // //console.log('Downloading attachment from URL:', pdfUrl);

        // Download the PDF from the URL with improved options
        const response = await axios.get(pdfUrl, {
          responseType: 'arraybuffer',
          headers: {
            'Accept': 'application/pdf, application/octet-stream'
          },
          maxContentLength: 10485760 // 10MB max
        });

        //console.log('Download successful, data size:', response.data.length, 'bytes');

        // Get filename from URL or use default
        const fileName = pdfUrl.split('/').pop() || 'document.pdf';

        // Encode the PDF data as base64
        const pdfBase64 = Buffer.from(response.data).toString('base64');

        // Split into chunks of 76 characters (more reliable than regex)
        const chunks = [];
        for (let i = 0; i < pdfBase64.length; i += 76) {
          chunks.push(pdfBase64.substring(i, i + 76));
        }
        const pdfEncoded = chunks.join('\r\n');

        //console.log('Attachment prepared with filename:', fileName);

        // Add attachment part to email
        messageParts = messageParts.concat([
          `--${boundary}`,
          'Content-Type: application/pdf',
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${fileName}"`,
          '',
          pdfEncoded,
          ''
        ]);
      } catch (attachmentError) {
        console.error('Error downloading attachment:', attachmentError.message);

        // Log more detail about the error for debugging
        if (attachmentError.response) {
          console.error('Response status:', attachmentError.response.status);
          console.error('Response headers:', JSON.stringify(attachmentError.response.headers));
        }

        // Continue sending email without attachment
        //console.log('Sending email without attachment due to download error');
      }
    }

    // Close the multipart message
    messageParts.push(`--${boundary}--`);

    const emailContent = messageParts.join('\r\n');

    // For debugging, log the size of the raw email
    //console.log('Email content length:', emailContent.length, 'bytes');

    // Encode the email to base64url format
    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    //console.log('Sending email to Gmail API...');

    // Send the email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    //console.log('Email sent successfully, ID:', result.data.id);

    // Save email record with sent status
    const emailRecord = await Email.create({
      userId: userId,
      to: to,
      subject: subject,
      message: message,
      messageId: result.data.id,
      isEmailSent: true,
      sentAt: new Date()
    });

    // Emit socket events
    emitEmailSent(userId, emailRecord);
    triggerStatsUpdate(userId);
    // Trigger dashboard update

    return res.status(200).json({ 
      success: true, 
      messageId: result.data.id,
      emailRecord 
    });
  } catch (error) {
    console.error('Send email error:', error.message);
    if (error.response) {
      console.error('API response error:', error.response.data);
    }
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};

// Send an email with attachments
export const sendEmailWithAttachment = async (req, res) => {
  try {
    const { to, cc, bcc, subject, message, pdfUrl } = req.body;
    const attachment = req.file; // For file uploads with multer
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    const name = user.name;
    const userResume = await UserResume.findOne({ userId, resume_link: pdfUrl });
    //console.log("userResume", userResume)
    const resume_title = userResume.resume_title;

    
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    
    // Check if attachment or pdfUrl exists
    if (!attachment && !pdfUrl) {
      return res.status(400).json({ error: 'No attachment provided. Please include either a file upload or provide a PDF URL.' });
    }
    
    // Helper function to validate and format recipients
    const formatRecipients = (recipients) => {
      if (!recipients) return '';
      
      // Handle both string and array inputs
      const recipientArray = Array.isArray(recipients) ? recipients : [recipients];
      
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      // Validate all email addresses
      const invalidEmails = recipientArray.filter(email => !emailRegex.test(email.trim()));
      if (invalidEmails.length > 0) {
        throw new Error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      }
      
      // Return comma-separated string of trimmed emails
      return recipientArray.map(email => email.trim()).join(', ');
    };
    
    // Format recipients
    const formattedTo = formatRecipients(to);
    const formattedCc = formatRecipients(cc);
    const formattedBcc = formatRecipients(bcc);
    
    // Validate that at least one recipient is provided
    if (!formattedTo) {
      return res.status(400).json({ error: 'At least one recipient in "to" field is required' });
    }
    
    // Set up OAuth2 client with user's refresh token
    const auth = setupOAuthWithRefreshToken(user.googleRefreshToken);
    
    // Create Gmail API client
    const gmail = google.gmail({ version: 'v1', auth });
    
    // Define boundary for multipart message - use a more unique boundary
    const boundary = `boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Properly format the HTML message content
    const formattedMessage = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  ${message.replace(/\n/g, '<br>')}
</body>
</html>`;
    
    // Build the email headers and HTML content
    const messageParts = [
      `From: ${user.email}`,
      `To: ${formattedTo}`,
    ];
    
    // Add CC and BCC headers if provided
    if (formattedCc) {
      messageParts.push(`Cc: ${formattedCc}`);
    }
    if (formattedBcc) {
      messageParts.push(`Bcc: ${formattedBcc}`);
    }
    
    // Continue with the rest of the headers
    messageParts.push(
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      formattedMessage,
      ''
    );
    
    // Handle attachment scenarios
    if (attachment) {
      // Case 1: File upload via multer
      const attachmentBase64 = attachment.buffer.toString('base64');
      
      messageParts.push(
        `--${boundary}`,
        `Content-Type: ${attachment.mimetype}`,
        'Content-Transfer-Encoding: base64',
        `Content-Disposition: attachment; filename="${attachment.originalname}"`,
        '',
        attachmentBase64,
        ''
      );
    } else if (pdfUrl) {
      // Case 2: PDF URL provided
      try {
        // Fetch the PDF from the URL
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data);
        const pdfBase64 = pdfBuffer.toString('base64');
        
        // Extract filename from URL or use default
        const filename = `${name} - ${resume_title}.pdf`;
        
        messageParts.push(
          `--${boundary}`,
          'Content-Type: application/pdf',
          'Content-Transfer-Encoding: base64',
          `Content-Disposition: attachment; filename="${filename}"`,
          '',
          pdfBase64,
          ''
        );
      } catch (fetchError) {
        console.error('Error fetching PDF from URL:', fetchError);
        return res.status(400).json({ error: 'Failed to fetch PDF from provided URL', details: fetchError.message });
      }
    }
    
    // Close the multipart message
    messageParts.push(`--${boundary}--`);
    
    const emailContent = messageParts.join('\r\n');
    
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
    
    // Count total recipients for response
    const totalRecipients = [
      ...(Array.isArray(to) ? to : [to]),
      ...(Array.isArray(cc) ? cc : cc ? [cc] : []),
      ...(Array.isArray(bcc) ? bcc : bcc ? [bcc] : [])
    ].length;
    
    return res.status(200).json({ 
      success: true, 
      messageId: result.data.id,
      attachmentType: attachment ? 'file' : 'url',
      recipients: {
        to: formattedTo,
        cc: formattedCc || undefined,
        bcc: formattedBcc || undefined,
        totalCount: totalRecipients
      }
    });
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
    const { email, jobTitle, jobDescription,companyName, resume_id, postId } = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // //console.log("req.body", req.body)

    // Get user from database with tokens
    // //console.log("userId", userId)
    // //console.log("resume_id", resume_id)
    // //console.log("jobTitle", jobTitle)
    // //console.log("jobDescription", jobDescription)

    const user = await User.findById(userId);
    //console.log("user", user)
    const userResume = await UserResume.findById(resume_id);
    //console.log("userResume", userResume)
    const { resume_title, resume_link } = userResume;
    //console.log("resume_title", resume_title)
    //console.log("resume_link", resume_link)
    const userPreferences = await UserPreferences.findOne({ preferences: resume_title });
    if (!user || !user.googleRefreshToken) {
      return res.status(401).json({ error: 'User not authenticated with Google' });
    }
    if (!userPreferences) {
      return res.status(400).json({ error: 'User preferences not found' });
    }

    //console.log("userPreferences", userPreferences)
    const emailParams = {
      to: email || "email@gmail.com",
      jobTitle: jobTitle || "Senior Frontend Developer",
      jobDescription: jobDescription || "We are looking for a passionate and skilled Software Engineer to design, develop, and maintain high-quality software solutions. You will work closely with cross-functional teams to build scalable applications, write clean and efficient code, and solve complex technical challenges across various projects such as developing internal tools, building customer-facing web apps, and optimizing cloud-based systems. A strong foundation in programming languages like JavaScript, Python, or Java, experience with modern frameworks, and a good understanding of databases and cloud technologies are essential. If you thrive in a fast-paced environment, enjoy contributing to impactful projects, and are committed to continuous learning, we'd love to hear from you.",
      summary: userPreferences.summary || "Highly motivated Software Engineer with over five years of experience in full-stack development. Proficient in designing, implementing, and optimizing scalable web applications. Passionate about problem-solving, automation, and cloud computing. Strong background in software development, database management, and DevOps practices",
      skills: userPreferences.skills || ["React", "JavaScript", "CSS"],
      projects: userPreferences.projects || ["Project A", "Project B"],
      candidateName: user.name || "John Doe",
      companyName: companyName,
      recruiterName: "Hiring Manager"
    };

    //console.log("emailParams")

    
    const data = generateEmailTemplate(emailParams);
    //console.log("Gmail Created:", data)

    const { to, subject, body } = data;
    const saveEmail = await Email.findOneAndUpdate(
      { userId, linkedInId: postId },
      { $set: { userId, linkedInId:postId, resumeId: resume_id,  isEmailGenerated: true, isEmailSent: false, to: email, subject, body, attachment: resume_link } },
      { upsert: true , new: true }
    )
    //console.log("saveEmail", saveEmail)

    //console.log("=== EMITTING EMAIL CREATED EVENT ===");
    //console.log("userId:", userId);
    //console.log("saveEmail:", saveEmail);
    
    // Emit socket event with proper data structure
    emitEmailCreated(userId, {
      type: 'email_created',
      data: saveEmail,
      postId: postId // Include postId for easier frontend handling
    });
    
    // Also emit a more specific event for real-time updates
    emitToUser(userId, 'post_email_status_updated', {
      postId: postId,
      isEmailGenerated: true,
      isEmailSent: false,
      emailData: saveEmail
    });

    triggerStatsUpdate(userId);
    
    res.status(201).json({
      success: true,
      message: "Email created and saved successfully",
      data: saveEmail
    });

  } catch (error) {
    console.error("Error creating email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create email",
      error: error.message
    });
  }
}

export const saveEmail = async (req, res) => {
  try {
    const { postId, resumeId, to, subject, body, pdfUrl } = req.body || req.saveEmailParams;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Save the email to the database (you need to implement this part)
    const saveEmail = await Email.findOneAndUpdate(
      { userId, linkedInId: postId },
      { $set: { userId, linkedInId: postId, resumeId, isEmailGenerated: true, isEmailSent: true, to, subject, body, attachment: pdfUrl } },
      { upsert: true, new: true }
    );
    //console.log("saveEmail", saveEmail)
    if (!saveEmail) {
      return res.status(404).json({ error: 'Email not found' });
    }

    triggerStatsUpdate(userId);
    res.status(200).json({ message: 'Email saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save email', details: error.message });
  }
}

export const getEmails = async (req, res) => {
  try {
    const { postId } = req.query || req.params;
    // //console.log("postId", postId)
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Fetch emails from the database (you need to implement this part)
    if (!postId) {
      const emails = await Email.find({ userId });
      if (!emails) {
        return res.status(404).json({ error: 'No emails found' });
      }
      return res.status(200).json(emails);
    }
    const emails = await Email.find({ userId, linkedInId: postId });
    if (!emails) {
      return res.status(404).json({ error: 'No emails found' });
    }

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

// Add the helper function


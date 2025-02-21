import  {transporter}  from "../utils/transporter.js";
import { bugReportEmailTemplate } from "../utils/emailBugTemplate.js";

export const bugForm = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const emailData = {
        from: process.env.EMAIL,
        to: email,
        subject: `ResumeTex: Bug report registered`,
        text: message,
        html: bugReportEmailTemplate(name),
    };
    const adminEmaildata = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `ResumeTex: Bug report registered`,
        text: message,
        html : `
        <div>
            <h1>Bug Report</h1>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Message: ${message}</p>
        </div>`
    }
    try {
        await transporter.sendMail(emailData);
        await transporter.sendMail(adminEmaildata);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
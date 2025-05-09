import { extractPdfData } from "../extractPdfData.js";
import { ConvertLatex } from "../latexConversion.js";
import { convertJsonTexToPdfLocally } from "../latexToPdf.js";
import { User, UserPreferences, UserResume } from "../../models/userSchema.js";
import fetch from 'node-fetch';
import { PDFDocument } from 'pdf-lib';
import { cloudinaryConfig, cloudinaryUploader } from "../../utils/cloudinary.js";



export const onboardResume = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to your needs
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.flushHeaders()
    const send = (event, data) => {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    try {
        const { pdfUrl, pref1, pref2, pref3 } = req.query; // Extract the PDF URL from the request body
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        send("Extracting data", { step: "extractpdf", status: "started" });
        const { extractedData } = await extractPdfData(pdfUrl);
        send("Extracting data", { step: "extractpdf", status: "completed", data: extractedData });

        send(`Fetching data for : ${pref1}`, { step: `FetchingData ${pref1}`, status: "started" });
        const apiKey1 = process.env.GEMINI_API_KEY_1;
        const { formattedLatex, email, name, title, summary, skills, projects } = await ConvertLatex(extractedData, pref1, apiKey1);
        console.log("formattedLatex", formattedLatex)
        console.log("starting pdf conversion")

        const user = await User.findOne({ email: email });

        if (user) {
            // Process the skills data - extract all skill items and flatten into a single array
            const flattenedSkills = Array.isArray(skills)
                ? skills.flatMap(category => Array.isArray(category.items) ? category.items : [])
                : [];

            // For projects, extract simplified data or convert to strings
            const simplifiedProjects = Array.isArray(projects)
                ? projects.map(project => project.title || project.name || JSON.stringify(project))
                : [];

            // Update or create user preferences with the extracted data
            const userPreferences = await UserPreferences.findOneAndUpdate(
                { userId: user._id },
                {
                    $set: {
                        preferences: pref1,
                        summary: summary || "",
                        skills: flattenedSkills,  // Flat array of strings
                        projects: simplifiedProjects, // Simplified projects data
                        updatedAt: Date.now()
                    }
                },
                { new: true, upsert: true }
            );

            console.log(`Saved user preferences for ${email}:`, {
                summary: summary ? summary.substring(0, 50) + "..." : "None provided",
                skills: `${flattenedSkills.length} skills saved`,
                projects: `${simplifiedProjects.length} projects saved`
            });
        } else {
            console.log(`User with email ${email} not found in database`);
        }

        const pdf1 = await convertJsonTexToPdfLocally(formattedLatex);
        const pdfUrl1 = pdf1.pdfUrl;
        const publicId1 = pdf1.publicId;
        const pdfName1 = pdf1.pdfName;
        send(`Fetching data for : ${pref1}`, { step: `FetchingData ${pref1}`, status: "completed", data: { pdfUrl: pdfUrl1 } });



        send(`Fetching data for : ${pref2}`, { step: `FetchingData ${pref2}`, status: "started" });
        const apiKey2 = process.env.GEMINI_API_KEY_5;
        const resposne2 = await ConvertLatex(extractedData, pref2, apiKey2);
        const formattedLatex2 = resposne2.formattedLatex;
        console.log("resposne2", resposne2)
        const pdf = await convertJsonTexToPdfLocally(formattedLatex2);
        console.log("pdf", pdf)
        const pdfUrl2 = pdf.pdfUrl;
        const publicId2 = pdf.publicId;
        const pdfName2 = pdf.pdfName;
        send(`Fetching data for : ${pref2}`, { step: `FetchingData ${pref2}`, status: "completed", data: { pdfUrl: pdfUrl2 } });

        send(`Fetching data for : ${pref3}`, { step: `FetchingData ${pref3}`, status: "started" });
        const apiKey3 = process.env.GEMINI_API_KEY_4;
        const resposne3 = await ConvertLatex(extractedData, pref3, apiKey3);
        const formattedLatex3 = resposne3.formattedLatex;
        const pdf3 = await convertJsonTexToPdfLocally(formattedLatex3);
        const pdfUrl3 = pdf3.pdfUrl;
        const publicId3 = pdf3.publicId;
        const pdfName3 = pdf3.pdfName;
        send(`Fetching data for : ${pref3}`, { step: `FetchingData ${pref3}`, status: "completed", data: { pdfUrl: pdfUrl3 } });


        const updateOnborad = await User.findOneAndUpdate({ userId: user._id }, { $set: { onboarded: true } }, { new: true });

        const userResume1 = await UserResume.findOneAndUpdate({ userId: user._id }, { $set: { resume: pdfUrl1, resume_title: pdfName1 } }, { new: true });
        const userResume2 = await UserResume.findOneAndUpdate({ userId: user._id }, { $set: { resume: pdfUrl2, resume_title: pdfName2 } }, { new: true });
        const userResume3 = await UserResume.findOneAndUpdate({ userId: user._id }, { $set: { resume: pdfUrl3, resume_title: pdfName3 } }, { new: true });


        res.write(`event: complete\n`);
        res.write(`data: ${JSON.stringify({ pdfUrl1, pdfUrl2, pdfUrl3, updateOnborad, userResume1, userResume2, userResume3 })}\n\n`);
        res.end(); // Close the connection after sending the final data
        console.log("Response sent to client");
        // res.json({ pref1, pref2, pref3 });

    } catch (error) {
        console.error('Error in onboardResume:', error);
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: 'Internal Server Error' })}\n\n`);
        res.end(); // Close the connection after sending the error

    }
}

export const getUserResume = async (req, res) => {
    try {
        const { userId } = req.params;
        const userResume = await UserResume.find({
            userId: userId
        });
        if (!userResume) {
            return res.status(404).json({ message: 'User resume not found' });
        }
        res.status(200).json(userResume);
    } catch (error) {
        console.error('Error fetching user resume:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}
function bytesToMB(bytes) {
  return (bytes / 1048576).toFixed(2) + " MB";
}

export const convertPdfToImage = async (req, res) => {
    try {
        const { pdfUrl } = req.query;
        
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        console.log('Starting PDF to image conversion');
        
        // Fetch the PDF
        const pdfResponse = await fetch(pdfUrl);
        const pdfBuffer = await pdfResponse.arrayBuffer();
        
        // Extract first page using pdf-lib
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        if (pdfDoc.getPageCount() === 0) {
            throw new Error('PDF has no pages');
        }
        
        // Create a new PDF with just the first page
        const singlePagePdf = await PDFDocument.create();
        const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [0]);
        singlePagePdf.addPage(copiedPage);
        
        const singlePagePdfBytes = await singlePagePdf.save();
        
        // Use Cloudinary's upload_stream for buffer uploads
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinaryUploader.upload_stream(
                {
                    resource_type: "image",
                    folder: 'resume_thumbnails',
                    format: 'png',
                    // For PDFs, Cloudinary will automatically use the first page
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            
            // Write the PDF buffer to the upload stream
            uploadStream.end(Buffer.from(singlePagePdfBytes));
        });
        
        console.log('Process completed successfully');
        res.status(200).json({
            pdfUrl: pdfUrl,
            imageUrl: result.secure_url,
            publicId: result.public_id,
            size: bytesToMB(result.bytes),
            format: result.format,
        });
        
    } catch (error) {
        console.error('Error in convertPdfToImage:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
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
        const { pdfUrl, pref } = req.query; // Extract the PDF URL from the request body
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        send("Extracting data", { step: "extractpdf", status: "started" });
        const { extractedData } = await extractPdfData(pdfUrl);
        send("Extracting data", { step: "extractpdf", status: "completed", data: extractedData });




        send(`Fetching data for : ${pref}`, { step: `FetchingData ${pref}`, status: "started" });
        const apiKey1 = process.env.GEMINI_API_KEY_1;
        const { formattedLatex, email, name, title, summary, skills, projects } = await ConvertLatex(extractedData, pref, apiKey1);
        send(`Fetching data for : ${pref}`, { step: `FetchingData ${pref}`, status: "completed", data: { formattedLatex, email, name, title, summary, skills, projects } });





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
            const userPreferences = await UserPreferences.create(
                {
                    userId: user._id,
                    preferences: pref,
                    summary: summary || "",
                    skills: flattenedSkills,  // Flat array of strings
                    projects: simplifiedProjects, // Simplified projects data
                    updatedAt: Date.now()
                },
            );

            console.log(`Saved user preferences for ${email}:`, {
                summary: summary ? summary.substring(0, 50) + "..." : "None provided",
                skills: `${flattenedSkills.length} skills saved`,
                projects: `${simplifiedProjects.length} projects saved`
            });
        } else {
            console.log(`User with email ${email} not found in database`);
        }


        const pdf = await convertJsonTexToPdfLocally(formattedLatex);
        const publicId = pdf.publicId;
        const pdfName = pdf.pdfName;
        send(`Fetching data for : ${pref}`, { step: `FetchingData ${pref}`, status: "completed", data: { pdfUrl: pdf.pdfUrl } });



        const updateOnborad = await User.findOneAndUpdate({ userId: user._id }, { $set: { onboarded: true } }, { new: true });


        const thumbnail = await pdfToImage(pdf.pdfUrl);
        const { imageUrl, publicId: thumbnailPublicId, size, format } = thumbnail;

        send(`Adding resume to user`, { step: `Adding resume to user`, status: "started" });
        const userResume = await UserResume.create({
            userId: user._id,
            resume_link: pdf.pdfUrl,
            resume_title: pref,
            thumbnail: imageUrl,
            file_type: 'pdf',
            description: '',
            updatedAt: new Date(),
            createdAt: new Date()
        })
        send(`Adding resume to user`, { step: `Adding resume to user`, status: "completed", data: { pdfUrl: pdf.pdfUrl } });
        console.log("userResume", userResume)


        res.write(`event: complete\n`);
        res.write(`data: ${JSON.stringify({ pdfUrl: pdf.pdfUrl, updateOnborad, userResume })}\n\n`);
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

export const addResume = async (req, res) => {
    try {
        const { userId, resume, resume_title } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const thubmnail = await pdfToImage(resume);
        if (!thubmnail) {
            return res.status(400).json({ message: 'Thumbnail generation failed' });
        }
        const { imageUrl, publicId, size, format } = thubmnail;


        const userResume = await UserResume.create(
            {
                userId: userId,
                resume_link: resume,
                resume_title: resume_title,
                thumbnail: imageUrl,
                file_type: 'pdf',
                description: '',
                updatedAt: new Date(),
                createdAt: new Date()
            },
        );


        res.status(200).json(userResume);
    } catch (error) {
        console.error('Error updating user resume:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}


function bytesToMB(bytes) {
    return (bytes / 1048576).toFixed(2) + " MB";
}



export const pdfToImage = async (pdfUrl) => {
    try {
        if (!pdfUrl) {
            throw new Error('PDF URL is required');
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

        console.log('PDF to image conversion completed successfully');
        return {
            pdfUrl: pdfUrl,
            imageUrl: result.secure_url,
            publicId: result.public_id,
            size: bytesToMB(result.bytes),
            format: result.format,
        };

    } catch (error) {
        console.error('Error in pdfToImage:', error);
        throw error;
    }
};

export const convertPdfToImage = async (req, res) => {
    try {
        const { pdfUrl } = req.query;

        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        const result = await pdfToImage(pdfUrl);
        res.status(200).json(result);

    } catch (error) {
        console.error('Error in convertPdfToImage controller:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
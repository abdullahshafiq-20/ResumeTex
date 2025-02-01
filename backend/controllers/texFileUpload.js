import { cloudinaryUploader } from "../utils/cloudinary.js";
import busboy from "busboy";

export const texContentUpload = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const bb = busboy({ headers: req.headers });
    let formattedLatex = '';

    bb.on('field', (name, val) => {
        if (name === 'formattedLatex') {
            formattedLatex = val;
        }
    });

    bb.on('finish', async () => {
        if (!formattedLatex) {
            return res.status(400).json({
                data: [],
                status: false,
                message: "No text content provided"
            });
        }

        // Create a buffer from the LaTeX content
        const buffer = Buffer.from(formattedLatex);

        // Upload directly to Cloudinary using buffer
        try {
            const uploadResult = await new Promise((resolve, reject) => {
                const cloudinaryStream = cloudinaryUploader.upload_stream(
                    {
                        resource_type: 'raw',
                        format: 'tex'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                cloudinaryStream.end(buffer);
            });

            res.json({
                data: {
                    url: uploadResult.secure_url,
                    name: uploadResult.original_filename,
                },
                status: true,
                message: "TEX file created and uploaded successfully!"
            });

        } catch (error) {
            console.error('Upload to Cloudinary failed:', error);
            res.status(500).json({
                data: [],
                status: false,
                message: error.message
            });
        }
    });

    bb.on('error', (error) => {
        console.error('Error processing form:', error);
        res.status(500).json({
            data: [],
            status: false,
            message: "Error processing form"
        });
    });

    req.pipe(bb);
};

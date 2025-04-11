import { cloudinaryUploader } from "../utils/cloudinary.js"
import busboy from "busboy"

// Separate reusable upload function
export const handlePdfUpload = async (file) => {
    try {
        if (!file) {
            throw new Error("No file provided")
        }

        // Check if file is PDF or TEX
        const allowedMimeTypes = ['application/pdf', 'application/x-tex', 'text/x-tex'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            // Remove the uploaded file
            fs.unlinkSync(file.path)
            throw new Error("Only PDF and TEX files are allowed")
        }

        // Upload file to cloudinary
        const uploadResult = await cloudinaryUploader.upload(file.path, {
            resource_type: 'raw', // Required for both PDF and TEX upload
            format: file.originalname.split('.').pop() // Preserve file extension
        })

        // Clean up - remove file from local storage
        fs.unlinkSync(file.path)
        

        return {
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            name: uploadResult.original_filename,
        }
    } catch (error) {
        // Clean up in case of error
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path)
        }
        throw error
    }
}

// Controller using the upload function
export const pdfUpload = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const bb = busboy({ headers: req.headers });

    bb.on('file', (name, file, info) => {
        const { filename, mimeType } = info;

        // Check if file is PDF or TEX
        const allowedMimeTypes = ['application/pdf', 'application/x-tex', 'text/x-tex'];
        if (!allowedMimeTypes.includes(mimeType)) {
            res.status(400).json({
                data: [],
                status: false,
                message: "Only PDF and TEX files are allowed"
            });
            return;
        }

        const cloudinaryStream = cloudinaryUploader.upload_stream(
            {
                resource_type: 'raw',
                format: filename.split('.').pop() // Preserve file extension
            },
            (error, result) => {
                if (error) {
                    console.error('Upload to Cloudinary failed:', error);
                    res.status(500).json({
                        data: [],
                        status: false,
                        message: "Upload to Cloudinary failed"
                    });
                } else {
                    res.json({
                        data: {
                            url: result.secure_url,
                            publicId: result.public_id,
                            name: result.original_filename,
                        },
                        status: true,
                        message: "File uploaded successfully!"
                    });
                }
            }
        );

        file.pipe(cloudinaryStream);
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
}
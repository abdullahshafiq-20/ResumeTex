import { cloudinaryUploader } from "../utils/cloudinary.js"
import fs from "fs"

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
export const pdfUpload = async (request, response) => {
    try {
        const uploadResult = await handlePdfUpload(request.file)
        
        response.json({
            data: uploadResult,
            status: true,
            message: "File uploaded successfully!"
        })

    } catch (error) {
        response.status(500).json({
            data: [],
            status: false,
            message: error.message,
        })
    }
}
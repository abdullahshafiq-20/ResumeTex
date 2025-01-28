import { cloudinaryUploader } from "../utils/cloudinary.js"
import fs from "fs"

// Separate reusable upload function
export const handlePdfUpload = async (file) => {
    try {
        if (!file) {
            throw new Error("No file provided")
        }

        // Check if file is PDF
        if (file.mimetype !== 'application/pdf') {
            // Remove the uploaded file
            fs.unlinkSync(file.path)
            throw new Error("Only PDF files are allowed")
        }

        // Upload PDF to cloudinary
        const uploadResult = await cloudinaryUploader.upload(file.path, {
            resource_type: 'raw' // Required for PDF upload
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
            message: "PDF uploaded successfully!"
        })

    } catch (error) {
        response.status(500).json({
            data: [],
            status: false,
            message: error.message,
        })
    }
}
import { cloudinaryUploader } from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";

// Helper function to create a temporary TEX file from text content
const createTempTexFile = (formattedLatex) => {
    const tempDir = path.join(process.cwd(), 'temp');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }
    
    const tempFilePath = path.join(tempDir, `temp_${Date.now()}.tex`);
    fs.writeFileSync(tempFilePath, formattedLatex);
    return tempFilePath;
};

export const texContentUpload = async (request, response) => {
    let tempFilePath = null;
    
    try {
        const { formattedLatex } = request.body;
        
        if (!formattedLatex) {
            throw new Error("No text content provided");
        }

        // Create temporary TEX file
        tempFilePath = createTempTexFile(formattedLatex);

        // Upload to Cloudinary using the same uploader as in fileUpload.js
        const uploadResult = await cloudinaryUploader.upload(tempFilePath, {
            resource_type: 'raw',
            format: 'tex'
        });

        // Clean up - remove temporary file
        fs.unlinkSync(tempFilePath);

        response.json({
            data: {
                url: uploadResult.secure_url,
                name: uploadResult.original_filename,
            },
            status: true,
            message: "TEX file created and uploaded successfully!"
        });

    } catch (error) {
        // Clean up temporary file in case of error
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }

        response.status(500).json({
            data: [],
            status: false,
            message: error.message,
        });
    }
};

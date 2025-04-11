import { cloudinaryUploader } from "../utils/cloudinary.js"

// Function to delete a specific file by ID
const deleteFileById = async (publicId) => {
    try {
        // Include options, especially if deleting non-image files
        const options = {
            resource_type: 'raw' // Change to 'raw' for non-image files
        };

        const result = await cloudinaryUploader.destroy(publicId, options);
        
        // Check if Cloudinary confirmed the deletion
        if (result.result !== 'ok') {
            console.error(`Deletion failed for ${publicId}. Cloudinary response:`, result);
            return { 
                success: false, 
                message: 'File not found or deletion failed', 
                result 
            };
        }

        console.log(`File deleted: ${publicId}`);
        return { 
            success: true, 
            message: 'File deleted successfully', 
            result 
        };
    } catch (error) {
        console.error(`Error deleting file ${publicId}:`, error);
        return { 
            success: false, 
            message: 'Error deleting file', 
            error: error.message 
        };
    }
};

// API controller function
const deleteFilesController = async (req, res) => {
    try {
        const { publicId } = req.body;

        if (!publicId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Public ID is required' 
            });
        }

        // Delete the file immediately instead of scheduling
        const result = await deleteFileById(publicId);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(200).json({ 
            success: true, 
            message: 'File deleted successfully' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

export { deleteFilesController };

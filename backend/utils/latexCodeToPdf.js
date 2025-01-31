import fs from 'fs';
import path from 'path';
import { cloudinaryUploader } from "../utils/cloudinary.js";
import latex from 'node-latex';
import { fileURLToPath } from 'url';

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Converts LaTeX code to a PDF and uploads it to Cloudinary.
 * @param {string} latexCode - The LaTeX code to convert.
 * @returns {Promise<string>} - URL of the uploaded PDF.
 */
export async function convertLatexToPdfAndUpload(latexCode) {
  try {
    // Create temp directory and paths
    const outputDir = path.join(__dirname, 'temp');
    const texFilePath = path.join(outputDir, 'cv.tex');
    const pdfFilePath = path.join(outputDir, 'cv.pdf');

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write LaTeX code to file
    fs.writeFileSync(texFilePath, latexCode, 'utf-8');

    // Convert LaTeX to PDF
    const output = fs.createWriteStream(pdfFilePath);
    const pdf = latex(latexCode);
    pdf.pipe(output);

    // Wait for PDF generation to complete
    await new Promise((resolve, reject) => {
      pdf.on('finish', resolve);
      pdf.on('error', reject);
    });

    // Upload PDF to Cloudinary
    const uploadResult = await cloudinaryUploader.upload(pdfFilePath, {
      resource_type: 'raw',
      format: 'pdf'
    });

    // Cleanup temp files
    [texFilePath, pdfFilePath].forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.error('Error converting LaTeX to PDF and uploading:', error);
    throw error;
  }
}

import fs from 'fs';
import path from 'path';
import latex from 'node-latex';
import { promisify } from 'util';
import { exec } from 'child_process';
import { cloudinaryUploader } from "../utils/cloudinary.js";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const execAsync = promisify(exec);

export const convertJsonTexToPdfLocally = async (req, res) => {
    const { formattedLatex } = req.body;

    if (!formattedLatex) {
        return res.status(400).json({ error: 'LaTeX content is required' });
    }

    try {
        // Verify pdflatex is installed
        // try {
        //     await execAsync('D:\\texlive\\2024\\bin\\windows\\pdflatex.exe --version', {
        //         env: {
        //             ...process.env,
        //             PATH: `D:\\texlive\\2024\\bin\\windows;${process.env.PATH}`
        //         }
        //     });
        // } catch (error) {
        //     console.error('pdflatex is not installed or not accessible:', error);
        //     return res.status(500).json({ 
        //         error: 'LaTeX compiler not found or not accessible. Please check the installation.'
        //     });
        // }

        // Define output file paths
        const outputDir = path.resolve('pdfs');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const timestamp = Date.now();
        const texFilePath = path.join(outputDir, `resume_${timestamp}.tex`);
        const pdfFilePath = path.join(outputDir, `resume_${timestamp}.pdf`);

        // Write the LaTeX content to a file
        await writeFileAsync(texFilePath, formattedLatex);

        // Create output stream
        const output = fs.createWriteStream(pdfFilePath);

        // Use the LaTeX content directly instead of creating a read stream
        const pdfStream = latex(formattedLatex, {
            errorLogs: path.join(outputDir, `latex_error_${timestamp}.log`),
            passes: 2,
            cmd: 'D:\\texlive\\2024\\bin\\windows\\pdflatex.exe',
            inputs: [outputDir],
            env: {
                ...process.env,
                PATH: `D:\\texlive\\2024\\bin\\windows;${process.env.PATH}`,
                TEXINPUTS: '.:',
            },
            precompiled: false,
            shellEscape: true
        });
        
        return new Promise((resolve, reject) => {
            pdfStream.pipe(output);

            pdfStream.on('error', async (err) => {
                console.error('LaTeX compilation error:', err);
                // Clean up the tex file if there's an error
                try {
                    await unlinkAsync(texFilePath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
                reject(err);
            });

            pdfStream.on('finish', async () => {
                try {
                    // Upload to Cloudinary
                    const uploadResult = await cloudinaryUploader.upload(pdfFilePath, {
                        resource_type: 'raw',
                        format: 'pdf'
                    });

                    // Clean up local files
                    await unlinkAsync(texFilePath);
                    await unlinkAsync(pdfFilePath);

                    // Return only the secure URL
                    res.status(200).json({
                        pdfUrl: uploadResult.secure_url
                    });
                } catch (error) {
                    console.error('Upload error:', error);
                    res.status(500).json({
                        error: 'Failed to upload PDF',
                        details: error.message
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error in PDF generation or upload:', error);
        return res.status(500).json({ 
            error: 'PDF generation or upload failed',
            details: error.message
        });
    }
};

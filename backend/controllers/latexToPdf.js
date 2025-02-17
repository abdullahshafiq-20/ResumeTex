import fs from 'fs';
import path from 'path';
import latex from 'node-latex';
import { promisify } from 'util';
import { cloudinaryUploader } from "../utils/cloudinary.js";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

export const convertJsonTexToPdfLocally = async (req, res) => {
    const { formattedLatex } = req.body;

    if (!formattedLatex) {
        return res.status(400).json({ error: 'LaTeX content is required' });
    }

    try {
        // Define output file paths
        const outputDir = path.resolve('pdfs');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const timestamp = Date.now();
        const texFilePath = path.join(outputDir, `resume_${timestamp}.tex`);
        const pdfFilePath = path.join(outputDir, `resume_${timestamp}.pdf`);
        const errorLogPath = path.join(outputDir, `latex_error_${timestamp}.log`);

        // Validate LaTeX content for common issues
        const validationResult = validateLatexContent(formattedLatex);
        if (!validationResult.isValid) {
            return res.status(400).json({ 
                error: 'Invalid LaTeX content', 
                details: validationResult.errors 
            });
        }

        // Write the LaTeX content to a file
        await writeFileAsync(texFilePath, formattedLatex);

        // Create output stream
        const output = fs.createWriteStream(pdfFilePath);

        // Use the LaTeX content directly
        const pdfStream = latex(formattedLatex, {
            errorLogs: errorLogPath,
            passes: 2,
            cmd: 'pdflatex',
            inputs: [outputDir],
            precompiled: false,
            shellEscape: true
        });
        
        pdfStream.pipe(output);

        return new Promise((resolve, reject) => {
            pdfStream.on('error', async (err) => {
                console.error('LaTeX compilation error:', err);
                
                try {
                    // Read error log if it exists
                    if (fs.existsSync(errorLogPath)) {
                        const errorLog = await readFileAsync(errorLogPath, 'utf8');
                        const parsedError = parseLatexError(errorLog);
                        
                        res.status(400).json({
                            error: 'LaTeX compilation failed',
                            details: parsedError.message,
                            lineNumber: parsedError.lineNumber,
                            suggestions: parsedError.suggestions
                        });
                    } else {
                        res.status(400).json({
                            error: 'LaTeX compilation failed',
                            details: err.message
                        });
                    }
                    
                    // Clean up files
                    await cleanupFiles([texFilePath, errorLogPath]);
                } catch (cleanupError) {
                    console.error('Error handling or cleanup error:', cleanupError);
                    res.status(500).json({ 
                        error: 'Failed to process LaTeX error',
                        details: cleanupError.message
                    });
                }
                reject(err);
            });

            output.on('finish', async () => {
                try {
                    // Check if PDF was actually created
                    if (!fs.existsSync(pdfFilePath) || fs.statSync(pdfFilePath).size === 0) {
                        if (fs.existsSync(errorLogPath)) {
                            const errorLog = await readFileAsync(errorLogPath, 'utf8');
                            const parsedError = parseLatexError(errorLog);
                            
                            res.status(400).json({
                                error: 'PDF generation failed',
                                details: parsedError.message,
                                lineNumber: parsedError.lineNumber,
                                suggestions: parsedError.suggestions
                            });
                        } else {
                            res.status(400).json({
                                error: 'PDF generation failed',
                                details: 'Unknown error occurred during PDF generation'
                            });
                        }
                        
                        await cleanupFiles([texFilePath, pdfFilePath, errorLogPath]);
                        return;
                    }

                    // Upload to Cloudinary
                    const uploadResult = await cloudinaryUploader.upload(pdfFilePath, {
                        resource_type: 'raw',
                        format: 'pdf'
                    });

                    // Clean up local files
                    await cleanupFiles([texFilePath, pdfFilePath, errorLogPath]);

                    // Return success response
                    res.status(200).json({
                        pdfUrl: uploadResult.secure_url
                    });
                } catch (error) {
                    console.error('Upload or processing error:', error);
                    res.status(500).json({
                        error: 'Failed to process or upload PDF',
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

/**
 * Validates LaTeX content for common issues
 * @param {string} content - The LaTeX content
 * @returns {Object} Validation result
 */
function validateLatexContent(content) {
    const result = {
        isValid: true,
        errors: []
    };

    // Check for document class
    if (!content.includes('\\documentclass')) {
        result.isValid = false;
        result.errors.push('Missing \\documentclass declaration');
    }

    // Check for document environment
    if (!content.includes('\\begin{document}') || !content.includes('\\end{document}')) {
        result.isValid = false;
        result.errors.push('Missing document environment (\\begin{document} ... \\end{document})');
    }

    // Check for common CV commands if they're used but not defined
    const cvCommands = ['\\cvitem', '\\cventry', '\\cvskill'];
    for (const cmd of cvCommands) {
        if (content.includes(cmd) && !content.includes('\\usepackage{moderncv}') && 
            !content.includes('\\documentclass{moderncv}')) {
            result.isValid = false;
            result.errors.push(`${cmd} used but moderncv package not loaded`);
        }
    }

    // Check for unbalanced braces
    const openBraces = content.split('{').length - 1;
    const closeBraces = content.split('}').length - 1;
    if (openBraces !== closeBraces) {
        result.isValid = false;
        result.errors.push(`Unbalanced braces: ${openBraces} opening '{' vs ${closeBraces} closing '}'`);
    }

    return result;
}

/**
 * Parse LaTeX error log to extract useful information
 * @param {string} errorLog - The LaTeX error log content
 * @returns {Object} Parsed error information
 */
function parseLatexError(errorLog) {
    const result = {
        message: 'Unknown LaTeX error',
        lineNumber: null,
        suggestions: []
    };

    // Extract the main error message
    const errorMatch = errorLog.match(/! (.+?)$/m);
    if (errorMatch) {
        result.message = errorMatch[1].trim();
    }

    // Extract line number if available
    const lineMatch = errorLog.match(/l\.(\d+)/);
    if (lineMatch) {
        result.lineNumber = parseInt(lineMatch[1]);
    }

    // Provide suggestions based on error type
    if (result.message.includes('Undefined control sequence')) {
        const cmdMatch = result.message.match(/Undefined control sequence\.\s*<.*>\s*(\\[a-zA-Z]+)/);
        if (cmdMatch) {
            const command = cmdMatch[1];
            result.suggestions = [
                `Command '${command}' is not defined. Check spelling or add the required package.`,
                `For CV commands like ${command}, make sure to include '\\usepackage{moderncv}' or use '\\documentclass{moderncv}'`,
                `Consider replacing ${command} with a standard LaTeX command or define it using \\newcommand`
            ];
        }
    } else if (result.message.includes('Missing $')) {
        result.suggestions = [
            'Math mode syntax error. Ensure all $ characters are properly paired.',
            'Check for special characters that need to be in math mode like _ or ^'
        ];
    } else if (result.message.includes('File not found')) {
        result.suggestions = [
            'Make sure the referenced file exists and is in the correct path',
            'Check for typos in the file name or path'
        ];
    }

    return result;
}

/**
 * Clean up temporary files
 * @param {Array} filePaths - Array of file paths to clean up
 */
async function cleanupFiles(filePaths) {
    for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
            try {
                await unlinkAsync(filePath);
            } catch (err) {
                console.error(`Failed to delete ${filePath}:`, err);
            }
        }
    }
}
import axios from "axios"
import pdfjsLib from "pdfjs-dist";
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { formatResumeToLatex } from "../utils/tokenizer.js"
import dotenv from 'dotenv';
dotenv.config();


// Configure the worker
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.js');

export const extractPdfData = async (req, res) => {
    try {
        const { pdfUrl } = req.body;
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        // Download PDF
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data, 'binary');

        // Parse PDF
        const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        let extractedText = '';
        const links = [];

        // Process each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedText += pageText + '\n';

            // Process annotations for hyperlinks
            const annotations = await page.getAnnotations();
            annotations.forEach(annotation => {
                if (annotation.subtype === 'Link' && annotation.url) {
                    const rect = annotation.rect;
                    const xMin = Math.min(rect[0], rect[2]);
                    const xMax = Math.max(rect[0], rect[2]);
                    const yMin = Math.min(rect[1], rect[3]);
                    const yMax = Math.max(rect[1], rect[3]);
                    let anchorText = '';
                    textContent.items.forEach(item => {
                        const x = item.transform[4];
                        const y = item.transform[5];
                        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
                            anchorText += item.str + ' ';
                        }
                    });
                    anchorText = anchorText.trim().replace(/\s+/g, ' ');
                    if (anchorText) {
                        links.push({ url: annotation.url, context: anchorText });
                    }
                }
            });

            // Process URLs found in text content
            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            let match;
            while ((match = urlRegex.exec(pageText)) !== null) {
                const url = match[0];
                const start = match.index;
                const end = start + url.length;
                const contextStart = Math.max(0, start - 30);
                const contextEnd = Math.min(pageText.length, end + 30);
                let context = pageText.slice(contextStart, contextEnd);
                // Clean up the context to avoid truncated words
                context = context.replace(/^\S*\s/, '').replace(/\s\S*$/, '');
                links.push({ url, context });
            }
        }

        const extractedData = {
            text: extractedText,
            links
        };

        // Convert to LaTeX
        const latexContent = await ConvertLatex(extractedData);
        // const formattedLatex = formatLatexContent(latexContent);
        const formattedLatex = formatResumeToLatex(latexContent);

        res.json({
            extractedData,
            latexContent,
            formattedLatex
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};

const ConvertLatex = async (extractedData) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_3);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const LATEX_CONVERSION_PROMPT = `You are a LaTeX expert. I will provide you with JSON data containing extracted text and links from a PDF document. Your task is to convert this into a professional LaTeX CV document.

        Input Structure:
        {
            "text": "[extracted text content]",
            "links": [
                {
                    "url": "[link URL]",
                    "context": "[link text]"
                }
                // ... more links
            ]
        }

        Required Tasks:

        1. Create a complete LaTeX document that:
        - Uses a professional CV template
        - Properly maps all hyperlinks to their text
        - Maintains professional formatting
        - Handles all special characters

        2. Follow these specific rules:
        - Search for each link's context in the main text
        - Wrap found contexts with \\href{url}{context}
        - Escape all special LaTeX characters (%, &, $, #, _, {, }, ~, ^)
        - Maintain proper document structure
        - Use consistent spacing and formatting

        3. Use this LaTeX package structure:
        \\documentclass[11pt,a4paper]{article}
        \\usepackage[utf8]{inputenc}
        \\usepackage[T1]{fontenc}
        \\usepackage{hyperref}
        \\usepackage[margin=1in]{geometry}
        \\usepackage{titlesec}
        \\usepackage{enumitem}
        \\usepackage{fontawesome}
        \\usepackage{xcolor}

        % Define professional colors
        \\definecolor{primary}{RGB}{0, 51, 102}
        \\definecolor{linkcolor}{RGB}{0, 102, 204}

        % Configure hyperref
        \\hypersetup{
            colorlinks=true,
            linkcolor=linkcolor,
            urlcolor=linkcolor
        }

        % Set section formatting
        \\titleformat{\\section}
            {\\Large\\bfseries\\color{primary}}
            {}{0em}{}[\\titlerule]

        4. Handle these specific cases:
        - If a link's context appears multiple times, link all instances
        - If a context isn't found exactly, look for close matches
        - Preserve any existing formatting (bold, italic)
        - Handle line breaks within link text
        - Process any Unicode characters correctly

        5. Generate the output maintaining:
        - Professional CV sections
        - Clean, readable LaTeX code
        - Proper indentation
        - Consistent formatting

        Process the following content and provide a complete LaTeX document:

        ${JSON.stringify(extractedData, null, 2)}`;

        const result = await model.generateContent(LATEX_CONVERSION_PROMPT);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('LaTeX conversion error:', error);
        throw new Error('Failed to convert to LaTeX');
    }
};






import pdfjsLib from "pdfjs-dist";
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import Count from '../models/countSchema.js';


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


        // const latexContent = await ConvertLatex(extractedData, template);
        // const link = await convertJsonTexToPdf(latexContent);

        res.json({
          extractedData
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};
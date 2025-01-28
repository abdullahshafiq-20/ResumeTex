import axios from "axios"
import * as pdfjs from "pdfjs-dist"


export const extractPdfData = async (req, res) => {
    try {
        const { pdfUrl } = req.body;
        console.log(pdfUrl)
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        // Download PDF
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data, 'binary');

        // Parse PDF
        const pdf = await pdfjs.getDocument({ data: pdfBuffer }).promise;
        const numPages = pdf.numPages;
        let extractedText = '';
        const links = new Set();

        // Process each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            
            // Extract text
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            extractedText += pageText + '\n';
            
            // Extract links from annotations
            const annotations = await page.getAnnotations();
            annotations.forEach(annotation => {
                if (annotation.subtype === 'Link' && annotation.url) {
                    links.add(annotation.url);
                }
            });

            // Extract URLs from text
            const urlRegex = /(https?:\/\/[^\s]+)/gi;
            const textUrls = pageText.match(urlRegex) || [];
            textUrls.forEach(url => links.add(url));
        }

        res.json({
            text: extractedText,
            links: Array.from(links)
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
};

import { extractPdfData } from "../extractPdfData.js";
import { ConvertLatex } from "../latexConversion.js";
import { convertJsonTexToPdfLocally } from "../latexToPdf.js";
import { User, UserPreferences } from "../../models/userSchema.js";




export const onboardResume = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust this to your needs
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.flushHeaders()
    const send = (event, data) => {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      };
    try {
        const { pdfUrl , pref1} = req.query; // Extract the PDF URL from the request body
        if (!pdfUrl) {
            return res.status(400).json({ error: 'PDF URL is required' });
        }

        send("Extracting data", { step: "extractpdf", status: "started" });
        const { extractedData } = await extractPdfData(pdfUrl);
        send("Extracting data", { step: "extractpdf", status: "completed", data: extractedData });

        send(`Fetching data for : ${pref1}`, { step: "fetchingData", status: "started" });
        const apiKey1 = process.env.GEMINI_API_KEY_3;
        const { formattedLatex, email, name, title} = await ConvertLatex(extractedData, pref1, apiKey1);
        console.log("formattedLatex", formattedLatex)
        console.log("starting pdf conversion")

        



        const { pdfUrl1, publicId1, pdfName1 } = await convertJsonTexToPdfLocally(formattedLatex);
        send(`Fetching data for : ${pref1}`, { step: "fetchingData", status: "completed", data: { pdfUrl: pdfUrl1} });

        // send(`Fetching data for : ${pref2}`, { step: "fetchingData", status: "started" });
        // const apiKey2 = process.env.GEMINI_API_KEY_2;
        // const { formattedLatex2, email2, name2, title2 } = await ConvertLatex(extractedData, pref2, apiKey2);
        // const { pdfUrl2, publicId2, pdfName2 } = await convertJsonTexToPdfLocally(formattedLatex2);
        // send(`Fetching data for : ${pref2}`, { step: "fetchingData", status: "completed", data: { pdfUrl: pdfUrl2} });

        // send(`Fetching data for : ${pref3}`, { step: "fetchingData", status: "started" });
        // const apiKey3 = process.env.GEMINI_API_KEY_3;
        // const { formattedLatex3, email3, name3, title3 } = await ConvertLatex(extractedData, pref3, apiKey3);
        // const { pdfUrl3, publicId3, pdfName3 } = await convertJsonTexToPdfLocally(formattedLatex3);
        // send(`Fetching data for : ${pref3}`, { step: "fetchingData", status: "completed", data: { pdfUrl: pdfUrl3} });

        res.write(`event: complete\n`);
        res.write(`data: ${JSON.stringify({ pdfUrl1 })}\n\n`);
        res.end(); // Close the connection after sending the final data
        console.log("Response sent to client");
        // res.json({ extractedData });

    } catch (error) {
        console.error('Error in onboardResume:', error);
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: 'Internal Server Error' })}\n\n`);
        res.end(); // Close the connection after sending the error
        
    }
}
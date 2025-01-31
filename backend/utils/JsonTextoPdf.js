import axios from 'axios';

async function convertJsonTexToPdf(texContent) {
    try {
        // First request to convert TEX to PDF
        const response = await axios.post(
            'https://api.advicement.io/v1/templates/pub-tex-to-pdf-with-pdflatex-v1/compile',
            {
                texFileContent: texContent
            },
            {
                headers: {
                    'Adv-Security-Token': process.env.ADVICEMENT_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extract the status URL from the response
        const statusUrl = response.data.documentStatusUrl;

        console.log('Status URL:', statusUrl);
        
        if (!statusUrl) {
            throw new Error('Status URL not found in the initial response');
        }

        // Add retry logic for getting the PDF URL
        let attempts = 0;
        const maxAttempts = 3;  // Original attempt + 2 retries
        const delayBetweenAttempts = 2000; // 2 seconds

        while (attempts < maxAttempts) {
            // Get the PDF status and URL
            const statusResponse = await axios.get(statusUrl);
            console.log(`Attempt ${attempts + 1} - Status response:`, statusResponse.data);

            if (!statusResponse.data) {
                throw new Error('Invalid response from status endpoint');
            }

            const pdfUrl = statusResponse.data.documentUrl;
            console.log(`Attempt ${attempts + 1} - PDF URL:`, pdfUrl);

            if (pdfUrl) {
                return pdfUrl;  // Success! Return the URL
            }

            // If we haven't found the URL yet and have more attempts
            if (attempts < maxAttempts - 1) {
                console.log(`PDF not ready yet. Waiting ${delayBetweenAttempts/1000} seconds before retry...`);
                await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
            }

            attempts++;
        }

        // If we get here, we've exhausted all attempts
        throw new Error('PDF URL not found after multiple attempts');

    } catch (error) {
        console.error('Error converting LaTeX to PDF:', {
            message: error.message,
            response: error.response?.data
        });
        throw new Error(`LaTeX to PDF conversion failed: ${error.message}`);
    }
}

export default convertJsonTexToPdf;

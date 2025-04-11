// this function is not in use

import axios from 'axios';
export const proxyPdf = async (req, res) => {
    try {
      const pdfUrl = req.query.url;
      
      // Validate the URL to ensure it's from your S3 bucket
      if (!pdfUrl.includes('amazonaws.com')) {
        return res.status(400).send('Invalid PDF URL');
      }
  
      // Fetch the PDF
      const response = await axios({
        method: 'get',
        url: pdfUrl,
        responseType: 'stream'
      });
  
      // Set headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      
      // Pipe the PDF stream to the response
      response.data.pipe(res);
    } catch (error) {
      console.error('Error proxying PDF:', error);
      res.status(500).send('Error fetching PDF');
    }
  };
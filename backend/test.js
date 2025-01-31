// 
import axios from 'axios';


async function convertJsonTexToPdf(url) {
    const response = await axios.get(url);
    const pdfUrl = response.data.documentUrl;
    return pdfUrl;
}

// Wrap execution in async function
async function main() {
    const url = 'https://advicement-prod-api-calls.s3.eu-west-1.amazonaws.com/5e295a2d6e179887/pub-tex-to-pdf-with-pdflatex-v1/726c75ad-d7d4-44cf-911b-6e4d24db73de/output/progress.json?AWSAccessKeyId=ASIA2LMZZZXSD6ALVHWY&Expires=1738344269&Signature=x7ON2J7WqgAZ0ehOAZTVzNxppH0%3D&X-Amzn-Trace-Id=Root%3D1-679cf93b-2899dded686bb9e774f94437%3BParent%3D222948e7b4164c3e%3BSampled%3D0%3BLineage%3D2%3A649baf5e%3A0&x-amz-security-token=IQoJb3JpZ2luX2VjELj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJHMEUCIQClAT5A9Nbxpx7rnRSXNvBZYVqy7p8e6SPlFeEqNKP7xgIgKcte2DznJUIirwJrnkZ%2B%2ByO7divD73GSlgYCV0ncwy0q8wIIwf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAFGgw3MTE2NzY1MTM3NjQiDILcz5q%2FGfSIll2FsirHAhQyJ6B%2FhwjS11PhwZcXqSIRKAga5fo37s04eVWUUqSp4Javbnm7WAV42oSPbCfgT4%2FNVIJHnpJeEUMcjnvzcWJR4IZG3Ziyn3PqdClfi4cw8BW3D2GOBA26oifBkMaQJ24syxYfdyHUBnxeBukssKKTVMP41KDXc3BLPvjOTv4VhE17Bu7PL68PqkhJuPay6yd2PgDk3E8sWF2J1y0LmllVVZXx5igB3aeUa1T9uErd4o5QfTgCJw9NHsQQaCv0pDZlxN1iq4HbP6kYrpiL16b82XAjQZpIdjisdaa8xS9wfS1y5OZfy6YPh46PLGPqEMWqHrkEEeVFXcSUBYXRkZuk8Qt5n9mOjPsam1QZLc8SxHN%2BsNjyBUApe0uEdkT6ElxP6ZB%2FQDREZ1ElwmJBtBk3yrOj9wGeoO%2FJVZ2kzKqguP3bRWXMgDCo3vO8BjqeASKQI8x5T95k7gYZHbxTCOfuFdn0gJgzi3GgznutTHSnwNZWOoCm4XGw4Adj5Cw1SlRwtPleNNp3gUV%2B88XSpFM940ho4Gy7s%2FCeg2TuU%2Fx8OhlbTr3YloTMg2iWT0S%2BbSg1CzI6eUUOWBfby4riqCFWan7fq898k9zJEfwSolpZVMxJeCLbmYc4gQw0l0lK95H%2BAo6Hov0sTPPirD4H';
    try {
        const link = await convertJsonTexToPdf(url);
        console.log(link);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Execute the main function
main();
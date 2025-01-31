// 
const axios = require('axios');


async function convertJsonTexToPdf(url) {
    const response = await axios.post(url);
    const pdfUrl = response.data.documentUrl;
    return pdfUrl;
}

// Wrap execution in async function
async function main() {
    const url = 'https://advicement-prod-api-calls.s3.eu-west-1.amazonaws.com/5e295a2d6e179887/pub-tex-to-pdf-with-pdflatex-v1/51613c30-12de-426b-873b-01fca49616da/output/progress.json?AWSAccessKeyId=ASIA2LMZZZXSKQAWNOAM&Expires=1738340142&Signature=yOwqNrVFNSbIg7OyjLfbG4v%2FcVU%3D&X-Amzn-Trace-Id=Root%3D1-679ce91c-6ca9171d3319e3ed42c6e1a4%3BParent%3D57451ff83eba61cf%3BSampled%3D0%3BLineage%3D2%3A649baf5e%3A0&x-amz-security-token=IQoJb3JpZ2luX2VjELf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJIMEYCIQDVMGrVBhksszoOLS0jDoy8DcwGydoefiJXtie9jZuaEgIhALReUeamAiY3655ptLS6mngGSTkxtRYOiLdG0z1fMtnAKvMCCMD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQBRoMNzExNjc2NTEzNzY0IgzuHyD8yVV6GtY58OgqxwLVPTHoAn%2Fb4xcOZOSEJjUF%2FYqLiCXeRO53V5cOpPLDiTmDbPgmwsC1KaAjPUCIAuqigsVy4SUGGopV8E05fJQvXJrRUCS9Ad9tSp0%2FXz%2BV3LqRh3ihuocBlnB9xyA0%2BbW4iktlGvmOGGHOFZ67WDh8XjcQoUH7W2Kxu4r7anp56DErqVmLw5hjN%2BVnAI5TbLNZVl894duIgxtg47e3ytatzXdccPlhuVlZ7bhVd3VCGwPqLfqPxuimlE2nbG4W5%2BSMVX9gN0ePL%2BgIGGQdTDPJGOSkWzyG578z5rAXw8OQi%2FWf2fdnf0EFcjTILO5jtVoYSrncvhWsVnSKbc9YUfxzcfjeuAnCpxOpei%2F1nOc1F0EdNhsw95nn2D%2FRYyBLDtunwKjqtNCFefmVtOV%2FrcfMMnIxrM4MAzsakQgMKdTTh6gWmmxoFv4wu8vzvAY6nQEGDiVsljbGXSLOeV4Pf9NdK3eM0n7VXikcX1Jkvp5xQl%2BqA0RZdq3dcAR8r4%2F2Benr2lY0iVHBC%2F0ZLVYHDcHm8AlSe8VDe5o9jI4DutgF4tCSahTdW6IDD%2Fz8qN042wIwt95bXK%2Bzsh1w8jJuqGLlFHobyK6TwR9jaturzMz9HzozXS4m8Icn5ykSeuZCE9KQ3xW40T4e5n%2BuTGRp';
    try {
        const link = await convertJsonTexToPdf(url);
        console.log(link);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Execute the main function
main();
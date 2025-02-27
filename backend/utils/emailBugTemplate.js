export const bugReportEmailTemplate = (name) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="noopener" target="_blank" rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Poppins', sans-serif !important;
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Poppins', sans-serif !important;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <tr>
                    <td style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">
                        <!-- Header with Logo -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="text-align: center; padding: 24px;">
                                    <img src="https://res.cloudinary.com/dlthjlibc/image/upload/v1740686845/email-logo-resumeLatex_cembnt.png" 
                                         alt="ResumeTex Logo" 
                                         style="width: 80px; height: auto; margin-bottom: 16px;"
                                    />
                                    <h1 style="color: #1200e4; font-size: 24px; margin: 0 0 8px 0; font-weight: 600;">ResumeTex</h1>
                                    <p style="color: #4b5563; font-size: 14px; margin: 0;">
                                        Transforming Simple PDFs into Professional LaTeX Resumes
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <!-- Content -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                            <tr>
                                <td>
                                    <p style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">Thank you ${name} for submitting a bug report!</p>
                                    <p style="color: #4b5563; margin-bottom: 16px;">We appreciate you taking the time to help improve ResumeTex. Your feedback is invaluable to us, and we've registered your report</p>
                                    
 

                                    <!-- Status Box -->
                                    <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin-bottom: 16px;">
                                        <p style="color: #166534; font-size: 14px; margin: 0;">
                                            ✓ Our development team has been notified and will review your report shortly.
                                        </p>
                                    </div>

                                    <!-- What's Next -->
                                    <div style="border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 24px;">
                                        <p style="color: #4b5563; font-size: 14px; margin-bottom: 12px; font-weight: 500;">
                                            What happens next:
                                        </p>
                                        <ul style="color: #6b7280; font-size: 14px; margin: 0; padding-left: 20px;">
                                            <li style="margin-bottom: 8px;">Our team will investigate the issue</li>
                                            <li style="margin-bottom: 8px;">We'll update you on our progress via email</li>
                                            <li>You may be contacted if we need additional information</li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Footer -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                            <tr>
                                <td style="text-align: center;">
                                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 12px;">Thank you for helping us improve ResumeTex!</p>
                                    <p style="color: #6b7280; font-size: 14px; margin: 0;">&copy; 2024 ResumeTex. All rights reserved.</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};
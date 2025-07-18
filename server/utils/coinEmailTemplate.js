// Professional Email Templates for Coin Management System - Inspired by emailTemplate.js

// Email template for requesting coins from admin
export const coinRequestTemplate = (userDetails) => {
    const { userName, userEmail, requestedCoins, reason, timestamp } = userDetails;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
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
                                    <h1 style="font-size: 24px; margin: 0 0 8px 0; font-weight: 600;">ResumeTex</h1>
                                    <p style="color: #4b5563; font-size: 14px; margin: 0;">
                                        Coin Request - Administrative Review Required
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <!-- Content -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                            <tr>
                                <td>
                                    <p style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">New Coin Request Submitted</p>
                                    <p style="color: #4b5563; margin-bottom: 24px;">A user has submitted a new coin request that requires administrative review. Please find the request details below:</p>

                                    <!-- Request Details Box -->
                                    <div style="border: 2px solid rgba(18,0,228,0.2); background-color: #f0f7ff; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                                        <h3 style="color: #1200e4; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">Request Information</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; width: 120px;">
                                                    <strong style="color: #374151;">User Name:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #1f2937;">${userName}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <strong style="color: #374151;">Email:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #1f2937;">${userEmail}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <strong style="color: #374151;">Requested Coins:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #1f2937; font-weight: 600; font-size: 16px;">${requestedCoins} coins</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <strong style="color: #374151;">Request Time:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #1f2937;">${timestamp}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Reason Box -->
                                    <div style="border: 1px solid #e5e7eb; background-color: #f9fafb; padding: 16px; margin-bottom: 20px; border-radius: 8px;">
                                        <h4 style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Request Reason:</h4>
                                        <p style="color: #1f2937; font-size: 14px; line-height: 1.5; margin: 0;">${reason}</p>
                                    </div>

                                    <!-- Status Box -->
                                    <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 16px;">
                                        <p style="color: #92400e; font-size: 14px; margin: 0;">
                                            📋 Status: Pending Administrative Review
                                        </p>
                                    </div>

                                    <!-- Info Box -->
                                    <div style="border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                            Please review this request and take appropriate action through the admin dashboard. The user will be notified via email once a decision is made.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Footer -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                            <tr>
                                <td style="text-align: center;">
                                    <p style="color: #6b7280; font-size: 14px; margin: 0;">&copy; 2025 ResumeTex. All rights reserved.</p>
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

// Email template for coin approval confirmation
export const coinApprovalTemplate = (approvalDetails) => {
    const { userName, approvedCoins, newBalance, approvalDate, adminNote } = approvalDetails;

    return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* Fallback fonts only */
    body {
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body style="margin:0; padding:0; font-family: 'Poppins', Arial, sans-serif; background-color: #f9fafb;">

  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;">

        <!-- Header with Logo -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 24px;">
              <img src="https://res.cloudinary.com/dlthjlibc/image/upload/v1740686845/email-logo-resumeLatex_cembnt.png" 
                   alt="ResumeTex Logo" 
                   style="width: 80px; height: auto; margin-bottom: 16px;" />
              <h1 style=" font-size: 24px; margin: 0 0 8px 0; font-weight: 600; font-family: 'Poppins', Arial, sans-serif;">ResumeTex</h1>
              <p style="color: #4b5563; font-size: 14px; margin: 0; font-family: 'Poppins', Arial, sans-serif;">
                Coin Request Approved - Your Balance Has Been Updated
              </p>
            </td>
          </tr>
        </table>

        <!-- Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
          <tr>
            <td>
              <p style="color: #1f2937; font-size: 18px; margin-bottom: 16px; font-family: 'Poppins', Arial, sans-serif;">
                Great News, ${userName}🎉
              </p>
              <p style="color: #4b5563; margin-bottom: 24px; font-family: 'Poppins', Arial, sans-serif;">
                Your coin request has been approved and the coins have been successfully added to your account. You can now use them for your resume conversions and other features.
              </p>

              <!-- Approval Details Box -->
              <div style="border: 2px solid rgba(16,185,129,0.3); background-color: #ecfdf5; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                <h3 style="color: #10b981; font-size: 16px; margin: 0 0 16px 0; font-weight: 600; font-family: 'Poppins', Arial, sans-serif;">
                  Approval Details
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; width: 140px;">
                      <strong style="color: #065f46; font-family: 'Poppins', Arial, sans-serif;">Approved Coins:</strong>
                    </td>
                    <td style="padding: 8px 0;">
                      <span style="color: #1f2937; font-weight: 600; font-size: 18px; font-family: 'Poppins', Arial, sans-serif;">+${approvedCoins} coins</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #065f46; font-family: 'Poppins', Arial, sans-serif;">New Balance:</strong>
                    </td>
                    <td style="padding: 8px 0;">
                      <span style="color: #1f2937; font-weight: 600; font-size: 18px; font-family: 'Poppins', Arial, sans-serif;">${newBalance} coins</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <strong style="color: #065f46; font-family: 'Poppins', Arial, sans-serif;">Approval Date:</strong>
                    </td>
                    <td style="padding: 8px 0;">
                      <span style="color: #1f2937; font-family: 'Poppins', Arial, sans-serif;">${approvalDate}</span>
                    </td>
                  </tr>
                </table>
              </div>

              ${adminNote ? `
              <!-- Admin Note Box -->
              <div style="border: 1px solid #e5e7eb; background-color: #f9fafb; padding: 16px; margin-bottom: 20px; border-radius: 8px;">
                <h4 style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: 600; font-family: 'Poppins', Arial, sans-serif;">Message from Admin:</h4>
                <p style="color: #1f2937; font-size: 14px; line-height: 1.5; margin: 0; font-family: 'Poppins', Arial, sans-serif;">${adminNote}</p>
              </div>
              ` : ''}

              <!-- Success Box -->
              <div style="background-color: #f0f7ff; border-left: 4px solid #1200e4; padding: 16px; margin-bottom: 16px;">
                <p style="color: #1e40af; font-size: 14px; margin: 0; font-family: 'Poppins', Arial, sans-serif;">
                  🎉 Your coins are now available and ready to use in your account!
                </p>
              </div>

              <!-- Help Box -->
              <div style="border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="color: #6b7280; font-size: 14px; margin: 0; font-family: 'Poppins', Arial, sans-serif;">
                  If you have any questions about using your coins or need assistance with resume conversions, feel free to reply to this email or contact our support team.
                </p>
              </div>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
          <tr>
            <td style="text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0; font-family: 'Poppins', Arial, sans-serif;">&copy; 2025 ResumeTex. All rights reserved.</p>
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

// Email template for coin rejection
export const coinRejectionTemplate = (rejectionDetails) => {
    const { userName, rejectionDate, adminNote, requestedCoins } = rejectionDetails;

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
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
                                    <h1 style=" font-size: 24px; margin: 0 0 8px 0; font-weight: 600;">ResumeTex</h1>
                                    <p style="color: #4b5563; font-size: 14px; margin: 0;">
                                        Coin Request Update - Review Complete
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <!-- Content -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px;">
                            <tr>
                                <td>
                                    <p style="color: #1f2937; font-size: 18px; margin-bottom: 16px;">Hello ${userName},</p>
                                    <p style="color: #4b5563; margin-bottom: 24px;">Thank you for your coin request. After careful review, we are unable to approve your request at this time. Please see the details below:</p>

                                    <!-- Request Summary Box -->
                                    <div style="border: 2px solid rgba(239,68,68,0.3); background-color: #fef2f2; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
                                        <h3 style="color: #ef4444; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">Request Summary</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            ${requestedCoins ? `
                                            <tr>
                                                <td style="padding: 8px 0; width: 140px;">
                                                    <strong style="color: #991b1b;">Requested Coins:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #1f2937; font-weight: 600;">${requestedCoins} coins</span>
                                                </td>
                                            </tr>
                                            ` : ''}
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <strong style="color: #991b1b;">Review Date:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="color: #1f2937;">${new Date(rejectionDate).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Admin Response Box -->
                                    <div style="border: 1px solid #e5e7eb; background-color: #f9fafb; padding: 16px; margin-bottom: 20px; border-radius: 8px;">
                                        <h4 style="color: #374151; font-size: 14px; margin: 0 0 8px 0; font-weight: 600;">Review Details:</h4>
                                        <p style="color: #1f2937; font-size: 14px; line-height: 1.5; margin: 0;">${adminNote || "Your request does not meet our current approval criteria. Please review our coin request guidelines and consider resubmitting when your circumstances change."}</p>
                                    </div>

                                    <!-- Information Box -->
                                    <div style="background-color: #f3f4f6; border-left: 4px solid #6b7280; padding: 16px; margin-bottom: 16px;">
                                        <p style="color: #374151; font-size: 14px; margin: 0;">
                                            💡 You may submit a new coin request in the future. Please review our guidelines and try again when your situation changes.
                                        </p>
                                    </div>

                                    <!-- Help Box -->
                                    <div style="border: 1px solid #e5e7eb; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                                        <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                            If you have questions about this decision or need clarification on our coin request policies, please reply to this email or contact our support team. We're here to help!
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <!-- Footer -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                            <tr>
                                <td style="text-align: center;">
                                    <p style="color: #6b7280; font-size: 14px; margin: 0;">&copy; 2025 ResumeTex. All rights reserved.</p>
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

// Export the templates for use in the application
// export { coinRequestTemplate, coinApprovalTemplate, coinRejectionTemplate };
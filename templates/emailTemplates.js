/**
 * Wraps inner email content with a shared, professional-looking
 * HTML shell so every email sent by the app shares the same branding.
 *
 * @param {string} title - Heading shown at the top of the email body
 * @param {string} bodyHtml - Inner HTML content specific to the email
 * @param {string} ctaText - Optional button label (e.g. "Open Dashboard")
 * @param {string} ctaUrl - Optional button link
 */
const baseTemplate = ({ title, bodyHtml, ctaText, ctaUrl }) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.3px;">🔔 Notification Center</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 16px 0;font-size:20px;color:#111827;">${title}</h1>
              <div style="font-size:15px;line-height:1.6;color:#374151;">
                ${bodyHtml}
              </div>
              ${
                ctaText && ctaUrl
                  ? `<div style="margin-top:28px;">
                      <a href="${ctaUrl}" style="background-color:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;display:inline-block;">${ctaText}</a>
                     </div>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                This is an automated message from Notification Center. Please do not reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const registrationTemplate = ({ name, dashboardUrl }) =>
  baseTemplate({
    title: `Welcome aboard, ${name}!`,
    bodyHtml: `<p>Your Notification Center account has been created successfully. You can now log in and start managing your clients, projects, and invoices.</p>`,
    ctaText: 'Open Dashboard',
    ctaUrl: dashboardUrl,
  });

const clientAddedTemplate = ({ name, clientName, dashboardUrl }) =>
  baseTemplate({
    title: 'New client added',
    bodyHtml: `<p>Hi ${name},</p><p>A new client, <strong>${clientName}</strong>, has been added to your account.</p>`,
    ctaText: 'View Clients',
    ctaUrl: dashboardUrl,
  });

const projectCreatedTemplate = ({ name, projectName, dashboardUrl }) =>
  baseTemplate({
    title: 'New project created',
    bodyHtml: `<p>Hi ${name},</p><p>Your new project, <strong>${projectName}</strong>, has been created and is ready to go.</p>`,
    ctaText: 'View Project',
    ctaUrl: dashboardUrl,
  });

const invoiceGeneratedTemplate = ({ name, invoiceNumber, amount, dashboardUrl }) =>
  baseTemplate({
    title: 'Invoice generated',
    bodyHtml: `<p>Hi ${name},</p><p>Invoice <strong>#${invoiceNumber}</strong> for <strong>$${amount}</strong> has been generated.</p>`,
    ctaText: 'View Invoice',
    ctaUrl: dashboardUrl,
  });

const invoicePaidTemplate = ({ name, invoiceNumber, amount, dashboardUrl }) =>
  baseTemplate({
    title: 'Invoice paid',
    bodyHtml: `<p>Hi ${name},</p><p>Great news! Invoice <strong>#${invoiceNumber}</strong> for <strong>$${amount}</strong> has been marked as paid.</p>`,
    ctaText: 'View Invoice',
    ctaUrl: dashboardUrl,
  });

module.exports = {
  registrationTemplate,
  clientAddedTemplate,
  projectCreatedTemplate,
  invoiceGeneratedTemplate,
  invoicePaidTemplate,
};

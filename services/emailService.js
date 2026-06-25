const transporter = require('../config/mailer');
const {
  registrationTemplate,
  clientAddedTemplate,
  projectCreatedTemplate,
  invoiceGeneratedTemplate,
  invoicePaidTemplate,
} = require('../templates/emailTemplates');

const dashboardUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`;

/**
 * Generic low-level sender. Wrapped in try/catch by every caller so that
 * a failed email never blocks the notification/API flow — it only logs.
 */
const sendMail = async ({ to, subject, html }) => {
  if (!to) return;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Notification Center <no-reply@notificationcenter.com>',
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: "${subject}"`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}: ${error.message}`);
  }
};

const sendRegistrationEmail = (user) =>
  sendMail({
    to: user.email,
    subject: 'Welcome to Notification Center 🎉',
    html: registrationTemplate({ name: user.name, dashboardUrl }),
  });

const sendClientAddedEmail = (user, clientName) =>
  sendMail({
    to: user.email,
    subject: `New client added: ${clientName}`,
    html: clientAddedTemplate({ name: user.name, clientName, dashboardUrl }),
  });

const sendProjectCreatedEmail = (user, projectName) =>
  sendMail({
    to: user.email,
    subject: `New project created: ${projectName}`,
    html: projectCreatedTemplate({ name: user.name, projectName, dashboardUrl }),
  });

const sendInvoiceGeneratedEmail = (user, invoiceNumber, amount) =>
  sendMail({
    to: user.email,
    subject: `Invoice #${invoiceNumber} generated`,
    html: invoiceGeneratedTemplate({ name: user.name, invoiceNumber, amount, dashboardUrl }),
  });

const sendInvoicePaidEmail = (user, invoiceNumber, amount) =>
  sendMail({
    to: user.email,
    subject: `Invoice #${invoiceNumber} paid ✅`,
    html: invoicePaidTemplate({ name: user.name, invoiceNumber, amount, dashboardUrl }),
  });

module.exports = {
  sendRegistrationEmail,
  sendClientAddedEmail,
  sendProjectCreatedEmail,
  sendInvoiceGeneratedEmail,
  sendInvoicePaidEmail,
};

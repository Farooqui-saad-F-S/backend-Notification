const nodemailer = require('nodemailer');

/**
 * Creates and exports a reusable Nodemailer transporter instance.
 * Configuration is read from environment variables so credentials
 * never live in source code.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  tls: {
    rejectUnauthorized: false,
  },
});
// Verify connection configuration on startup (non-blocking).
// If SMTP credentials are missing/invalid, the app still runs —
// emails will simply fail and be logged, which is fine for local testing.
transporter.verify((error) => {
  if (error) {
    console.warn('⚠️  Nodemailer SMTP verification failed. Emails will not be sent.');
    console.warn(`   Reason: ${error.message}`);
  } else {
    console.log('✅ Nodemailer is ready to send emails');
  }
});

module.exports = transporter;

const Notification = require('../models/Notification');
const { emitToUser } = require('../sockets/socket');
const emailService = require('./emailService');

/**
 * Core reusable function: creates a notification document, saves it,
 * emits it in real time over Socket.IO to the owning user's room,
 * and also emits an updated unread count.
 *
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.title
 * @param {string} params.message
 * @param {string} params.type - one of Notification.TYPES
 */
const createAndDispatchNotification = async ({ userId, title, message, type }) => {
  const notification = await Notification.create({ userId, title, message, type });

  // Real-time push of the new notification itself
  emitToUser(userId, 'notification:new', notification);

  // Real-time push of the updated unread count
  const unreadCount = await Notification.countDocuments({ userId, read: false });
  emitToUser(userId, 'notification:unreadCount', { unreadCount });

  return notification;
};

/**
 * Each of the functions below corresponds to one business event in the
 * simulated SaaS app. They build the right title/message, create + emit
 * the notification, and fire the matching email — all in one call.
 */

const notifyRegistration = async (user) => {
  const notification = await createAndDispatchNotification({
    userId: user._id,
    title: 'Welcome to Notification Center',
    message: `Hi ${user.name}, your account has been created successfully.`,
    type: 'REGISTER',
  });
  await emailService.sendRegistrationEmail(user);
  return notification;
};

const notifyClientAdded = async (user, clientName) => {
  const notification = await createAndDispatchNotification({
    userId: user._id,
    title: 'New client added',
    message: `Client "${clientName}" has been added to your account.`,
    type: 'CLIENT_ADDED',
  });
  await emailService.sendClientAddedEmail(user, clientName);
  return notification;
};

const notifyProjectCreated = async (user, projectName) => {
  const notification = await createAndDispatchNotification({
    userId: user._id,
    title: 'New project created',
    message: `Project "${projectName}" has been created.`,
    type: 'PROJECT_CREATED',
  });
  await emailService.sendProjectCreatedEmail(user, projectName);
  return notification;
};

const notifyInvoiceGenerated = async (user, invoiceNumber, amount) => {
  const notification = await createAndDispatchNotification({
    userId: user._id,
    title: 'Invoice generated',
    message: `Invoice #${invoiceNumber} for $${amount} has been generated.`,
    type: 'INVOICE_GENERATED',
  });
  await emailService.sendInvoiceGeneratedEmail(user, invoiceNumber, amount);
  return notification;
};

const notifyInvoicePaid = async (user, invoiceNumber, amount) => {
  const notification = await createAndDispatchNotification({
    userId: user._id,
    title: 'Invoice paid',
    message: `Invoice #${invoiceNumber} for $${amount} has been marked as paid.`,
    type: 'INVOICE_PAID',
  });
  await emailService.sendInvoicePaidEmail(user, invoiceNumber, amount);
  return notification;
};

module.exports = {
  createAndDispatchNotification,
  notifyRegistration,
  notifyClientAdded,
  notifyProjectCreated,
  notifyInvoiceGenerated,
  notifyInvoicePaid,
};

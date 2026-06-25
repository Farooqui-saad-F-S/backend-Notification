const Notification = require('../models/Notification');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const { emitToUser } = require('../sockets/socket');

/**
 * Helper: loads the user a simulated event should apply to.
 * In the test panel, the logged-in user is always the target,
 * but we accept an explicit userId in the body for flexibility
 * (e.g. an admin triggering a notification for another user).
 */
const resolveTargetUser = async (req) => {
  const userId = req.body.userId || req.user?._id;
  if (!userId) return null;
  return User.findById(userId);
};

// @route   POST /api/notifications/register
// @desc    Simulate a "new account registration" event
const simulateRegister = async (req, res, next) => {
  try {
    const user = await resolveTargetUser(req);
    if (!user) return res.status(404).json({ success: false, message: 'Target user not found' });

    const notification = await notificationService.notifyRegistration(user);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/notifications/client-added
// @desc    Simulate a "new client added" event
const simulateClientAdded = async (req, res, next) => {
  try {
    const user = await resolveTargetUser(req);
    if (!user) return res.status(404).json({ success: false, message: 'Target user not found' });

    const clientName = req.body.clientName || `Client ${Math.floor(Math.random() * 1000)}`;
    const notification = await notificationService.notifyClientAdded(user, clientName);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/notifications/project-created
// @desc    Simulate a "new project created" event
const simulateProjectCreated = async (req, res, next) => {
  try {
    const user = await resolveTargetUser(req);
    if (!user) return res.status(404).json({ success: false, message: 'Target user not found' });

    const projectName = req.body.projectName || `Project ${Math.floor(Math.random() * 1000)}`;
    const notification = await notificationService.notifyProjectCreated(user, projectName);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/notifications/invoice-generated
// @desc    Simulate an "invoice generated" event
const simulateInvoiceGenerated = async (req, res, next) => {
  try {
    const user = await resolveTargetUser(req);
    if (!user) return res.status(404).json({ success: false, message: 'Target user not found' });

    const invoiceNumber = req.body.invoiceNumber || Math.floor(1000 + Math.random() * 9000);
    const amount = req.body.amount || (Math.random() * 1000).toFixed(2);
    const notification = await notificationService.notifyInvoiceGenerated(user, invoiceNumber, amount);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/notifications/invoice-paid
// @desc    Simulate an "invoice paid" event
const simulateInvoicePaid = async (req, res, next) => {
  try {
    const user = await resolveTargetUser(req);
    if (!user) return res.status(404).json({ success: false, message: 'Target user not found' });

    const invoiceNumber = req.body.invoiceNumber || Math.floor(1000 + Math.random() * 9000);
    const amount = req.body.amount || (Math.random() * 1000).toFixed(2);
    const notification = await notificationService.notifyInvoicePaid(user, invoiceNumber, amount);
    res.status(201).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/notifications/:userId
// @desc    Get all notifications for a user, newest first
const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // A user may only read their own notifications
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these notifications' });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    const unreadCount = await Notification.countDocuments({ userId, read: false });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/notifications/:id/read
// @desc    Mark a single notification as read
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this notification' });
    }

    notification.read = true;
    await notification.save();

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
    emitToUser(req.user._id, 'notification:unreadCount', { unreadCount });

    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/notifications/:id
// @desc    Delete a single notification
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notification' });
    }

    await notification.deleteOne();

    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
    emitToUser(req.user._id, 'notification:unreadCount', { unreadCount });
    emitToUser(req.user._id, 'notification:deleted', { id: req.params.id });

    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  simulateRegister,
  simulateClientAdded,
  simulateProjectCreated,
  simulateInvoiceGenerated,
  simulateInvoicePaid,
  getNotifications,
  markAsRead,
  deleteNotification,
};

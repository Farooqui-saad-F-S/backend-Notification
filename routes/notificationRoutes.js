const express = require('express');
const {
  simulateRegister,
  simulateClientAdded,
  simulateProjectCreated,
  simulateInvoiceGenerated,
  simulateInvoicePaid,
  getNotifications,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All notification routes require a logged-in user
router.use(protect);

// Simulation / event-trigger endpoints (used by the Testing Panel)
router.post('/register', simulateRegister);
router.post('/client-added', simulateClientAdded);
router.post('/project-created', simulateProjectCreated);
router.post('/invoice-generated', simulateInvoiceGenerated);
router.post('/invoice-paid', simulateInvoicePaid);

// CRUD-style endpoints
router.get('/:userId', getNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;

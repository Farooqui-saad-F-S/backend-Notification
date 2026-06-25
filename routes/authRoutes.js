const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  handleValidationErrors,
  registerValidationRules,
  loginValidationRules,
} = require('../middleware/validators');

const router = express.Router();

router.post('/register', registerValidationRules, handleValidationErrors, register);
router.post('/login', loginValidationRules, handleValidationErrors, login);
router.get('/me', protect, getMe);

module.exports = router;

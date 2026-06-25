const { body, validationResult } = require('express-validator');

/**
 * Runs after the express-validator chains below and short-circuits
 * the request with a 400 response if any validation rule failed.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const registerValidationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidationRules = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const notificationValidationRules = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('extra').optional(),
];

module.exports = {
  handleValidationErrors,
  registerValidationRules,
  loginValidationRules,
  notificationValidationRules,
};

const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const error = validationResult(req);

  if (error.isEmpty()) {
    return next();
  }

  res.status(400).json({
    error: error.array(),
  });
};

const registerValidator = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email is required.')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage("Invalid email format"),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required.')
    .matches(/^(?=.*[a-z])(?=.*\d).{6,}$/)
    .withMessage(
      "Password must contain at least 6 characters, one lowercase letter and one number"
    ),
  
  validate
];

module.exports = registerValidator;

const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, refreshToken, logout } = require('../controllers/authController');

router.post('/register', [
  body('username').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['student', 'parent', 'teacher', 'admin'])
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').isString().notEmpty()
], login);

router.post('/refresh-token', [
  body('token').optional().isString()
], refreshToken);

router.post('/logout', [
  body('token').optional().isString()
], logout);

module.exports = router;

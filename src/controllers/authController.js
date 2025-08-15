const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { success } = require('../utils/responseHandler');

const signAccess = (userId, role) => {
  return jwt.sign({ sub: userId, role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'
  });
};

const signRefresh = (userId) => {
  return jwt.sign({ sub: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  });
};

const setRefreshCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: isProd, // Ensures cookie is sent over HTTPS in production
    sameSite: 'strict', // Provides some CSRF protection
    path: '/', // Cookie is valid for all routes
    maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expires in 7 days
  });
};

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    const { username, email, password, role } = req.body;

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ username, email, password, role });
    return success(res, { message: 'User registered successfully.' }, 201);
  } catch (err) { next(err); }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', data: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const accessToken = signAccess(user._id.toString(), user.role);
    const refreshToken = signRefresh(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshCookie(res, refreshToken);
    return success(res, { message: 'Login successful.', data: { accessToken } }, 200); // Omit refreshToken in the response
  } catch (err) { next(err); }
};

// POST /auth/refresh-token
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken; // Always expect token from cookies
    if (!token) return res.status(401).json({ success: false, message: 'Missing refresh token' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.sub).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ success: false, message: 'Refresh token mismatch' });
    }

    const newAccessToken = signAccess(user._id.toString(), user.role);
    return success(res, { message: 'Token refreshed.', data: { accessToken: newAccessToken } }, 200);
  } catch (err) { next(err); }
};

// POST /auth/logout
const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(400).json({ success: false, message: 'Missing refresh token' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      // Clear cookie if the token is invalid
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    }

    const user = await User.findById(decoded.sub).select('+refreshToken');
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie('refreshToken', { path: '/' });
    return success(res, { message: 'Logged out successfully.' }, 200);
  } catch (err) { next(err); }
};

module.exports = { register, login, refreshToken, logout };
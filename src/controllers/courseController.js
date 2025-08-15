const { validationResult } = require('express-validator');
const Course = require('../models/Course');
const { success } = require('../utils/responseHandler');

// POST /courses  (teacher)
const createCourse = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', data: errors.array(), pagination: null });

    const { title, description } = req.body;
    const course = await Course.create({ title, description, teacherId: req.user._id });
    return success(res, { message: 'Course created.', data: course }, 201);
  } catch (err) { next(err); }
};

// GET /courses  (teacher, student) with pagination
const listCourses = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.user.role === 'teacher') filter.teacherId = req.user._id;

    const [items, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Course.countDocuments(filter)
    ]);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };

    return success(res, { message: 'Courses retrieved.', data: items, pagination }, 200);
  } catch (err) { next(err); }
};

module.exports = { createCourse, listCourses };

const { validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const { success } = require('../utils/responseHandler');

// POST /assignments (teacher)
const createAssignment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', data: errors.array(), pagination: null });

    const { title, courseId, content, dueDate } = req.body;

    // ensure teacher owns the course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found', data: null, pagination: null });
    if (req.user.role === 'teacher' && String(course.teacherId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Cannot create assignment for another teacher\'s course', data: null, pagination: null });
    }

    const assignment = await Assignment.create({ title, courseId, content, dueDate });
    return success(res, { message: 'Assignment created.', data: assignment }, 201);
  } catch (err) { next(err); }
};

// GET /assignments/course/:courseId (teacher, student)
const listByCourse = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const { courseId } = req.params;

    const filter = { courseId };
    const [items, total] = await Promise.all([
      Assignment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Assignment.countDocuments(filter)
    ]);

    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    };

    return success(res, { message: 'Assignments retrieved.', data: items, pagination }, 200);
  } catch (err) { next(err); }
};

module.exports = { createAssignment, listByCourse };

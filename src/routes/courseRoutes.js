const router = require('express').Router();
const { body, query } = require('express-validator');
const { createCourse, listCourses } = require('../controllers/courseController');
const { auth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', auth, allowRoles('teacher'), [
  body('title').isString().notEmpty(),
  body('description').optional().isString()
], createCourse);

router.get('/', auth, allowRoles('teacher', 'student'), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], listCourses);

module.exports = router;

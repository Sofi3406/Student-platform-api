const router = require('express').Router();
const { body, param, query } = require('express-validator');
const { createAssignment, listByCourse } = require('../controllers/assignmentController');
const { auth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/', auth, allowRoles('teacher'), [
  body('title').isString().notEmpty(),
  body('courseId').isMongoId(),
  body('content').isString().notEmpty(),
  body('dueDate').isISO8601()
], createAssignment);

router.get('/course/:courseId', auth, allowRoles('teacher', 'student'), [
  param('courseId').isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], listByCourse);

module.exports = router;

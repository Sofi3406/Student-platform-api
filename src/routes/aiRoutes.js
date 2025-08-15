const router = require('express').Router();
const { body } = require('express-validator');
const { generateLessonPlanCtrl } = require('../controllers/aiController');
const { auth } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

router.post('/generate-lesson-plan', auth, allowRoles('teacher'), [
  body('topic').isString().notEmpty(),
  body('gradeLevel').isString().notEmpty(),
  body('objectives').isArray().optional()
], generateLessonPlanCtrl);

module.exports = router;

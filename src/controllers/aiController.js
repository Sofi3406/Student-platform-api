const { validationResult } = require('express-validator');
const { success } = require('../utils/responseHandler');
const { generateLessonPlan } = require('../services/googleGeminiService');

// POST /ai/generate-lesson-plan (teacher)
const generateLessonPlanCtrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', data: errors.array(), pagination: null });

    const { topic, gradeLevel, objectives } = req.body;
    const lessonPlan = await generateLessonPlan({ topic, gradeLevel, objectives });
    return success(res, { message: 'Lesson plan generated successfully.', data: { lessonPlan } }, 200);
  } catch (err) { next(err); }
};

module.exports = { generateLessonPlanCtrl };

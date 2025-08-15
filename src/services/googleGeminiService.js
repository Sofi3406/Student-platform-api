const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

const generateLessonPlan = async ({ topic, gradeLevel, objectives = [] }) => {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Create a detailed lesson plan.
Topic: ${topic}
Grade Level: ${gradeLevel}
Learning Objectives: ${objectives.join('; ')}

Include: Introduction, Objectives mapped to activities, Materials, Step-by-step procedure, Differentiation, Assessment, Homework, Estimated duration.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text;
};

module.exports = { generateLessonPlan };

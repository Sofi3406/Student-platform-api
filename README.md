🎓 Student Platform Backend
A role-based educational backend system powered by Node.js, Express, MongoDB, and Google Gemini AI.
Supports students, teachers, parents, and admin roles — with token-based authentication and AI-powered lesson planning.

Monolithic REST API using **Node.js + Express + MongoDB (Mongoose)** with **JWT auth (access + refresh)**, **RBAC**, **Swagger (OpenAPI 3.0)**, and a **Google Gemini** powered lesson plan generator.

🚀 Features
🔐 Authentication with JWT & refresh tokens
👥 Role-based access control (admin, teacher, student, parent)
📚 Course & Assignment creation and retrieval
🤖 AI Lesson Plan Generator (Google Gemini)
🧠 Clean architecture with Controllers, Routes, Services, Middleware
📦 MongoDB integration using Mongoose
🧪 Tested via swagger



## Tech
- Node.js, Express.js
- MongoDB + Mongoose
- JWT (access + refresh) + httpOnly cookie for refresh
- RBAC middleware
- OpenAPI 3.0 (`swagger.json`) served at `/docs`
- Google Generative AI SDK (`@google/generative-ai`) for lesson plans


🏗 Folder Structure

```
student-platform-back-end/
├── server.js
├── .env.example
├── package.json
├── README.md
├── swagger.json
├── scripts/
│   └── exportSwagger.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── assignmentController.js
│   │   └── aiController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Assignment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── assignmentRoutes.js
│   │   └── aiRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── services/
│   │   └── googleGeminiService.js
│   └── utils/
│       └── responseHandler.js
```

## Security Notes
- Refresh token is stored **in DB** and also sent in an **httpOnly cookie**; you may choose to omit it from the JSON response in production.
- Use HTTPS in production and set the `secure` cookie option.
- Inputs are validated with `express-validator` in the routes.

## Demo Video
https://www.awesomescreenshot.com/video/43170804?key=e6d5010947a1986a5ae20fc201c1daca
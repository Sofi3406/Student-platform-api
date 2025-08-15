# Student Platform API Backend

Monolithic REST API using **Node.js + Express + MongoDB (Mongoose)** with **JWT auth (access + refresh)**, **RBAC**, **Swagger (OpenAPI 3.0)**, and a **Google Gemini** powered lesson plan generator.

## Tech
- Node.js, Express.js
- MongoDB + Mongoose
- JWT (access + refresh) + httpOnly cookie for refresh
- RBAC middleware
- OpenAPI 3.0 (`swagger.json`) served at `/docs`
- Google Generative AI SDK (`@google/generative-ai`) for lesson plans


## Folder Structure
See the repo tree below (created for you):

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

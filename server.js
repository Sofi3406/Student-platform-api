const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/utils/responseHandler');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const assignmentRoutes = require('./src/routes/assignmentRoutes');
const aiRoutes = require('./src/routes/aiRoutes');

const app = express();

// CORS (allow cookies)
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const swaggerPath = path.join(__dirname, 'swagger.json');
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Base API path/version
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/ai', aiRoutes);


app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK', data: null, pagination: null });
});


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('DB connection failed', err);
  process.exit(1);
});

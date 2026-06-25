const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// ----- Global Middleware -----
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger — handy for local development
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// ----- Health check -----
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Notification Center API is running' });
});

// ----- Routes -----
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);

// ----- 404 + Error Handling (must be last) -----
app.use(notFound);
app.use(errorHandler);

module.exports = app;

const express    = require('express');
const cors       = require('cors');
const { FRONTEND_URL } = require('../constants/server');
const errorHandler     = require('../middlewares/errorHandler');
const authRoutes       = require('../routes/authRoutes');
const chatRoutes       = require('../routes/chatRoutes');

const app = express();

// Core Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE'] }));
app.use(express.json());

// Routes
app.get('/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

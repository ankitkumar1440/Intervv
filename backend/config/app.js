const express    = require('express');
const cors       = require('cors');
const { FRONTEND_URL } = require('../constants/server');
const errorHandler     = require('../middlewares/errorHandler');
const authRoutes       = require('../routes/authRoutes');
const chatRoutes       = require('../routes/chatRoutes');

const app = express();

const corsOptions = {
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
};

if (process.env.NODE_ENV === 'production') {
  corsOptions.origin = FRONTEND_URL;
} else {
  corsOptions.origin = true;
}

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.get('/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

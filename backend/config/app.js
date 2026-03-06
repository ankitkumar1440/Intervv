const express      = require('express');
const cors         = require('cors');
const errorHandler = require('../middlewares/errorHandler');
const authRoutes   = require('../routes/authRoutes');
const chatRoutes   = require('../routes/chatRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  credentials: false,
}));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

module.exports = app;
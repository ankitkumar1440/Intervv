require('dotenv').config();

const app       = require('./config/app');
const connectDB = require('./config/db');
const { PORT }  = require('./constants/server');

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀  Server  →  http://0.0.0.0:${PORT}`);
    console.log(`📡  Health  →  http://0.0.0.0:${PORT}/health`);
  });
});
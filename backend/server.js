require('dotenv').config();

const app       = require('./config/app');
const connectDB = require('./config/db');
const { PORT }  = require('./constants/server');

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Server  →  http://localhost:${PORT}`);
    console.log(`📡  Health  →  http://localhost:${PORT}/health`);
  });
});

const mongoose          = require('mongoose');
const { MONGO_URI }     = require('../constants/server');

const connectDB = async () => {
  if (!MONGO_URI) {
    console.warn('⚠️  MONGO_URI not set — skipping database connection (development only).');
    return;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('🗄️  MongoDB connected');
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
  }
};

module.exports = connectDB;

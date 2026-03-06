// All environment-driven constants.

module.exports = {
  PORT:           process.env.PORT           || 5000,
  FRONTEND_URL:   process.env.FRONTEND_URL   || 'http://localhost:5173',
  GROQ_MODEL:     process.env.GROQ_MODEL     || 'llama3-8b-8192',
  MAX_TOKENS:     parseInt(process.env.MAX_TOKENS) || 500,
  MONGO_URI:      process.env.MONGO_URI,
  JWT_SECRET:     process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

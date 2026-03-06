const Groq = require('groq-sdk');

// Single shared instance
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

module.exports = groq;

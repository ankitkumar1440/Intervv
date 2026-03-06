const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../constants/server');

/**
 * Generates a signed JWT for a given user ID.
 * @param {string} id - MongoDB user _id
 * @returns {string} signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

module.exports = generateToken;

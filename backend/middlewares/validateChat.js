const validateChat = (req, res, next) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required and must be a non-empty string.' });
  }

  if (message.trim().length > 2000) {
    return res.status(400).json({ error: 'message exceeds the 2000 character limit.' });
  }

  next();
};

module.exports = validateChat;

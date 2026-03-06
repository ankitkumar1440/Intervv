const { getAIReply } = require('../utils/aiService');
const Chat           = require('../models/Chat');

const chat = async (req, res, next) => {
  try {
    const { message }  = req.body;
    const userId       = req.user._id;
    let   chatSession;

    if (req.params.chatId) {
      chatSession = await Chat.findOne({ _id: req.params.chatId, user: userId });
      if (!chatSession) return res.status(404).json({ error: 'Chat session not found.' });
    } else {
      chatSession = await Chat.create({
        user:     userId,
        title:    message.trim().slice(0, 40), 
        messages: [],
      });
    }

    const history = chatSession.messages.map(({ role, content }) => ({ role, content }));
    const reply   = await getAIReply(message.trim(), history);

    chatSession.messages.push({ role: 'user',      content: message.trim() });
    chatSession.messages.push({ role: 'assistant', content: reply });
    await chatSession.save();

    res.json({ reply, chatId: chatSession._id });
  } catch (err) {
    next(err);
  }
};

const getChatSessions = async (req, res, next) => {
  try {
    const sessions = await Chat.find({ user: req.user._id })
      .select('title createdAt')
      .sort({ createdAt: -1 });

    res.json({ sessions });
  } catch (err) {
    next(err);
  }
};

const getChatById = async (req, res, next) => {
  try {
    const chatSession = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });
    if (!chatSession) return res.status(404).json({ error: 'Chat session not found.' });

    res.json({ chat: chatSession });
  } catch (err) {
    next(err);
  }
};

const deleteChat = async (req, res, next) => {
  try {
    const chatSession = await Chat.findOneAndDelete({ _id: req.params.chatId, user: req.user._id });
    if (!chatSession) return res.status(404).json({ error: 'Chat session not found.' });

    res.json({ message: 'Chat deleted.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { chat, getChatSessions, getChatById, deleteChat };

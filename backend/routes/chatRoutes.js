const { Router }    = require('express');
const {
  chat, getChatSessions, getChatById, deleteChat,
}                   = require('../controllers/chatController');
const validateChat  = require('../middlewares/validateChat');
const protect       = require('../middlewares/authMiddleware');

const router = Router();

router.use(protect);

router.get ('/',              getChatSessions);
router.post('/',     validateChat, chat);
router.get ('/:chatId',       getChatById);
router.post('/:chatId', validateChat, chat);
router.delete('/:chatId',     deleteChat);           

module.exports = router;

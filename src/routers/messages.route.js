const { Router } = require('express');
const {
  getMessages,
} = require('../controllers/message.controller');
const checkAuthenticated = require('../middleware/auth.middleware');

const messageRouter = new Router();

messageRouter.get('', checkAuthenticated, getMessages);

module.exports = { messageRouter };

const { Router } = require('express');
const {
  getMessages,
} = require('../controllers/message.controller');

const messageRouter = new Router();

messageRouter.get('', getMessages);

module.exports = { messageRouter };

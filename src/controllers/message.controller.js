const Message = require('../models/message-model');
const logger = require('../utils/logger');

const log = logger.child({ module: 'Message controller' });

async function getMessages(req, res) {
  try {
    log.info('Searching all messages');
    const allMessages = await Message.find();
    res.status(200).send(allMessages);
    log.info('All messages sent');
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = {
  getMessages,
};

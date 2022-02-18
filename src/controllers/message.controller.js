const MessageDaoFactory = require('../services/message/message-factory');
const logger = require('../utils/logger');

const MessageDao = MessageDaoFactory.getDao();
const log = logger.child({ module: 'Message controller' });

async function getMessages(req, res) {
  const where = {};
  const { id } = req.params;
  if (id) {
    where.user = id;
  }
  try {
    if (req.user.role !== 'admin' && !id) {
      res.status(401).send({ message: 'Unauthorized request to get all messages' });
    }
    log.info('Searching all messages');
    const allMessages = await MessageDao.getAll(where);
    res.status(200).send(allMessages);
    log.info('All messages sent');
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = {
  getMessages,
};

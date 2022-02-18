const MessageDaoFactory = require('../services/message/message-factory');

const messageDao = MessageDaoFactory.getDao();

function createSocket(io) {
  io.on('connection', (socket) => {
    socket.on('chat message', async (msg) => {
      await messageDao.create({ user: msg.userId, text: msg.text });
      io.emit('chat message', msg);
    });
  });
}

module.exports = createSocket;

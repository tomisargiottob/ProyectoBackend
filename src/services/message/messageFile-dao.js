const fs = require('fs');
const { v4: uuid } = require('uuid');
const MessageDao = require('./message-dao');
const returnMessages = require('./message-dto');

let instance;

class MessageDaoFile extends MessageDao {
  constructor(logger) {
    super(logger);
    this.file = 'messages.json';
    try {
      this.messages = fs.readFileSync(this.file, 'utf-8');
      this.messages = JSON.parse(this.messages);
    } catch (err) {
      this.messages = [];
    }
  }

  async create(message) {
    if (!this.messages) {
      this.messages = [];
    }
    // eslint-disable-next-line no-param-reassign
    message.id = uuid();
    // eslint-disable-next-line no-param-reassign
    message.createdAt = new Date();
    this.messages.push(message);
    await fs.promises.writeFile(this.file, JSON.stringify(this.messages, null, 2));
    const createdMessage = returnMessages(message);
    return createdMessage;
  }

  find(id) {
    const messageFound = this.messages.filter((message) => message.id === id);
    if (messageFound) {
      return returnMessages(messageFound[0]);
    }
    throw new Error('Message not found');
  }

  getAll() {
    let messages;
    try {
      this.messages = fs.readFileSync(this.file, 'utf-8');
      this.messages = JSON.parse(this.messages);
      messages = returnMessages(this.messages);
    } catch (err) {
      this.log.warn('file not created yet, creating new one');
    }
    return messages || [];
  }

  async delete(id) {
    try {
      this.messages = fs.readFileSync(this.file, 'utf-8');
      this.messages = JSON.parse(this.messages).filter((message) => message.id !== id);
      fs.writeFileSync(this.file, JSON.stringify(this.messages, null, 2));
      return true;
    } catch (err) {
      this.logger.error(err);
      return true;
    }
  }

  async update(id, data) {
    const messageFound = this.messages.findIndex((message) => message.id === id);
    if (messageFound >= 0) {
      // eslint-disable-next-line no-param-reassign
      data.id = id;
      this.messages[messageFound] = data;
      await fs.promises.writeFile(this.file, JSON.stringify(this.messages, null, 2));
      return this.messages[messageFound];
    }
    throw new Error('Message not found');
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new MessageDaoFile(logger);
    return instance;
  }
}

module.exports = MessageDaoFile;

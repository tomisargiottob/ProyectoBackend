/* eslint-disable no-underscore-dangle */
const { v4: uuid } = require('uuid');
const MessageDao = require('./message-dao');
const returnMessages = require('./message-dto');

let instance;

class MessageDaoMemory extends MessageDao {
  constructor(logger) {
    super(logger);
    this.messages = [];
  }

  async getAll() {
    return this.messages;
  }

  async find(id) {
    const message = this.messages.find((msg) => {
      if (msg.id === id) {
        return msg;
      }
      return false;
    });
    if (message) {
      return returnMessages(message);
    }
    throw new Error('msg not found');
  }

  async update(id, data) {
    const index = this.messages.findIndex((msg) => {
      if (msg.id === id) {
        return msg;
      }
      return false;
    });
    if (index >= 0) {
      this.messages[index] = data;
      this.messages[index].id = id;
      return returnMessages(this.messages[index]);
    }
    throw new Error('msg not found');
  }

  async delete(id) {
    this.messages = this.messages.filter((msg) => msg.id !== id);
    return true;
  }

  async create(data) {
    const msg = {
      id: uuid(),
      user: data.user,
      text: data.text,
      time: new Date(),
    };
    this.messages.push(msg);
    return returnMessages(this.messages);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new MessageDaoMemory(logger);
    return instance;
  }
}

module.exports = MessageDaoMemory;

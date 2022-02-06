/* eslint-disable class-methods-use-this */
const MessageDao = require('./message-dao');
const MessageModel = require('../../models/message-model');
const returnMessages = require('./message-dto');

let instance;

class MessageDaoMongo extends MessageDao {
  async getAll() {
    const messagesMongo = await MessageModel.find();
    const messages = returnMessages(messagesMongo);
    return messages;
  }

  async find(id) {
    let message;
    try {
      message = await MessageModel.find({ id });
      if (message) {
        return returnMessages(message);
      }
    } catch (err) {
      throw new Error('Error looking for Message');
    }
    throw new Error('Message not found');
  }

  async update(id, data) {
    // eslint-disable-next-line no-param-reassign
    data.id = id;
    const message = await MessageModel.findOneAndUpdate(id, data, { new: true });
    if (message) {
      return returnMessages(message);
    }
    throw new Error('Message not found');
  }

  async delete(id) {
    await MessageModel.findOneAndRemove(id);
  }

  async create(data) {
    const message = await MessageModel.create(data);
    return returnMessages(message);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new MessageDaoMongo(logger);
    return instance;
  }
}

module.exports = MessageDaoMongo;

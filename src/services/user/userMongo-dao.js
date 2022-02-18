/* eslint-disable class-methods-use-this */
const UserDao = require('./user-dao');
const UserModel = require('../../models/user-model');
const returnUsers = require('./user-dto');

let instance;

class UserDaoMongo extends UserDao {
  async getAll(where) {
    const usersMongo = await UserModel.find(where);
    const users = returnUsers(usersMongo);
    return users;
  }

  async find() {
    let user;
    try {
      user = await UserModel.findOne();
      if (user) {
        return returnUsers(user);
      }
    } catch (err) {
      throw new Error('Error looking for User');
    }
    // throw new Error('User not found');
  }

  async update(id, data) {
    // eslint-disable-next-line no-param-reassign
    data.id = id;
    const user = await UserModel.findOneAndUpdate(id, data, { new: true });
    if (user) {
      return returnUsers(user);
    }
    throw new Error('User not found');
  }

  async delete(id) {
    await UserModel.findOneAndRemove(id);
  }

  async create(data) {
    const user = await UserModel.create(data);
    return returnUsers(user);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new UserDaoMongo(logger);
    return instance;
  }
}

module.exports = UserDaoMongo;

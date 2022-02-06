/* eslint-disable no-underscore-dangle */
const { v4: uuid } = require('uuid');
const UserDao = require('./user-dao');
const returnUsers = require('./user-dto');

let instance;

class UserDaoMemory extends UserDao {
  constructor(logger) {
    super(logger);
    this.users = [];
  }

  async getAll() {
    return this.users;
  }

  async find(id) {
    const foundUser = this.users.find((user) => {
      if (user.id === id) {
        return user;
      }
      return false;
    });
    if (foundUser) {
      return returnUsers(foundUser);
    }
    throw new Error('user not found');
  }

  async update(id, data) {
    const index = this.users.findIndex((user) => {
      if (user.id === id) {
        return user;
      }
      return false;
    });
    if (index >= 0) {
      this.users[index] = data;
      this.users[index].id = id;
      return returnUsers(this.users[index]);
    }
    throw new Error('User not found');
  }

  async delete(id) {
    this.users = this.users.filter((user) => user.id !== id);
    return true;
  }

  async create(data) {
    const user = {
      id: uuid(),
      username: data.username,
      cart: data.cart,
      address: data.address,
      age: data.age,
      telephone: data.telephone,
      avatar: data.avatar,
      role: data.role,
    };
    this.users.push(user);
    return returnUsers(this.users);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new UserDaoMemory(logger);
    return instance;
  }
}

module.exports = UserDaoMemory;

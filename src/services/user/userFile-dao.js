const fs = require('fs');
const { v4: uuid } = require('uuid');
const UserDao = require('./user-dao');
const returnUsers = require('./user-dto');

let instance;

class UserDaoFile extends UserDao {
  constructor(logger) {
    super(logger);
    this.file = 'users.json';
    try {
      this.users = fs.readFileSync(this.file, 'utf-8');
      this.users = JSON.parse(this.users);
    } catch (err) {
      this.users = [];
    }
  }

  async create(user) {
    if (!this.users) {
      this.users = [];
    }
    // eslint-disable-next-line no-param-reassign
    user.id = uuid();
    this.users.push(user);
    await fs.promises.writeFile(this.file, JSON.stringify(this.users, null, 2));
    const createdUser = returnUsers(user);
    return createdUser;
  }

  find(id) {
    const userFound = this.users.filter((user) => user.id === id);
    if (userFound) {
      return returnUsers(userFound[0]);
    }
    throw new Error('User not found');
  }

  getAll() {
    let users;
    try {
      this.users = fs.readFileSync(this.file, 'utf-8');
      this.users = JSON.parse(this.users);
      users = returnUsers(this.users);
    } catch (err) {
      this.log.warn('file not created yet, creating new one');
    }
    return users || [];
  }

  async delete(id) {
    try {
      this.users = fs.readFileSync(this.file, 'utf-8');
      this.users = JSON.parse(this.users).filter((user) => user.id !== id);
      fs.writeFileSync(this.file, JSON.stringify(this.users, null, 2));
      return true;
    } catch (err) {
      this.logger.error(err);
      return true;
    }
  }

  async update(id, data) {
    const userFound = this.users.findIndex((user) => user.id === id);
    if (userFound >= 0) {
      // eslint-disable-next-line no-param-reassign
      data.id = id;
      this.users[userFound] = data;
      await fs.promises.writeFile(this.file, JSON.stringify(this.users, null, 2));
      return this.users[userFound];
    }
    throw new Error('User not found');
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new UserDaoFile(logger);
    return instance;
  }
}

module.exports = UserDaoFile;

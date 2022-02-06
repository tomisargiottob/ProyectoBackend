/* eslint-disable no-underscore-dangle */
const { v4: uuid } = require('uuid');
const CartDao = require('./cart-dao');
const returnCarts = require('./cart-dto');

let instance;

class CartDaoMemory extends CartDao {
  constructor(logger) {
    super(logger);
    this.carts = [];
  }

  async getAll() {
    return this.carts;
  }

  async find(id) {
    const cart = this.carts.find((msg) => {
      if (msg.id === id) {
        return msg;
      }
      return false;
    });
    if (cart) {
      return returnCarts(cart);
    }
    throw new Error('msg not found');
  }

  async update(id, data) {
    const index = this.carts.findIndex((msg) => {
      if (msg.id === id) {
        return msg;
      }
      return false;
    });
    if (index >= 0) {
      this.carts[index] = data;
      this.carts[index].id = id;
      return returnCarts(this.carts[index]);
    }
    throw new Error('msg not found');
  }

  async delete(id) {
    this.carts = this.carts.filter((msg) => msg.id !== id);
    return true;
  }

  async create(data) {
    const cart = {
      id: uuid(),
      products: data.products,
      user: data.user,
    };
    this.carts.push(cart);
    return returnCarts(this.carts);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new CartDaoMemory(logger);
    return instance;
  }
}

module.exports = CartDaoMemory;

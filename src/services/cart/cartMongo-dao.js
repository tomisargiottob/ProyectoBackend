/* eslint-disable class-methods-use-this */
const CartDao = require('./cart-dao');
const CartModel = require('../../models/cart-model');
const returnCarts = require('./cart-dto');

let instance;

class CartDaoMongo extends CartDao {
  async getAll() {
    const cartsMongo = await CartModel.find();
    const carts = returnCarts(cartsMongo);
    return carts;
  }

  async find(id) {
    let cart;
    try {
      cart = await CartModel.find({ id });
      if (cart) {
        return returnCarts(cart);
      }
    } catch (err) {
      throw new Error('Error looking for Cart');
    }
    throw new Error('Cart not found');
  }

  async update(id, data) {
    // eslint-disable-next-line no-param-reassign
    data.id = id;
    const cart = await CartModel.findOneAndUpdate(id, data, { new: true });
    if (cart) {
      return returnCarts(cart);
    }
    throw new Error('Cart not found');
  }

  async delete(id) {
    await CartModel.findOneAndRemove(id);
  }

  async create(data) {
    const cart = await CartModel.create(data);
    return returnCarts(cart);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new CartDaoMongo(logger);
    return instance;
  }
}

module.exports = CartDaoMongo;

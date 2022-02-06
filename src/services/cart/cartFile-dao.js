const fs = require('fs');
const { v4: uuid } = require('uuid');
const CartDao = require('./cart-dao');
const returnCarts = require('./cart-dto');

let instance;

class CartDaoFile extends CartDao {
  constructor(logger) {
    super(logger);
    this.file = 'carts.json';
    try {
      this.carts = fs.readFileSync(this.file, 'utf-8');
      this.carts = JSON.parse(this.carts);
    } catch (err) {
      this.carts = [];
    }
  }

  async create(cart) {
    if (!this.carts) {
      this.carts = [];
    }
    // eslint-disable-next-line no-param-reassign
    cart.id = uuid();
    this.carts.push(cart);
    await fs.promises.writeFile(this.file, JSON.stringify(this.carts, null, 2));
    const createdCart = returnCarts(cart);
    return createdCart;
  }

  find(id) {
    const cartFound = this.carts.filter((cart) => cart.id === id);
    if (cartFound) {
      return returnCarts(cartFound[0]);
    }
    throw new Error('Cart not found');
  }

  getAll() {
    let carts;
    try {
      this.carts = fs.readFileSync(this.file, 'utf-8');
      this.carts = JSON.parse(this.carts);
      carts = returnCarts(this.carts);
    } catch (err) {
      this.log.warn('file not created yet, creating new one');
    }
    return carts || [];
  }

  async delete(id) {
    try {
      this.carts = fs.readFileSync(this.file, 'utf-8');
      this.carts = JSON.parse(this.carts).filter((cart) => cart.id !== id);
      fs.writeFileSync(this.file, JSON.stringify(this.carts, null, 2));
      return true;
    } catch (err) {
      this.logger.error(err);
      return true;
    }
  }

  async update(id, data) {
    const cartFound = this.carts.findIndex((cart) => cart.id === id);
    if (cartFound >= 0) {
      // eslint-disable-next-line no-param-reassign
      data.id = id;
      this.carts[cartFound] = data;
      await fs.promises.writeFile(this.file, JSON.stringify(this.carts, null, 2));
      return this.carts[cartFound];
    }
    throw new Error('Cart not found');
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new CartDaoFile(logger);
    return instance;
  }
}

module.exports = CartDaoFile;

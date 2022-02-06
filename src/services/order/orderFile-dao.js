const fs = require('fs');
const { v4: uuid } = require('uuid');
const OrderDao = require('./order-dao');
const returnOrders = require('./order-dto');

let instance;

class OrderDaoFile extends OrderDao {
  constructor(logger) {
    super(logger);
    this.file = 'orders.json';
    try {
      this.orders = fs.readFileSync(this.file, 'utf-8');
      this.orders = JSON.parse(this.orders);
    } catch (err) {
      this.orders = [];
    }
  }

  async create(order) {
    if (!this.orders) {
      this.orders = [];
    }
    // eslint-disable-next-line no-param-reassign
    order.id = uuid();
    this.orders.push(order);
    await fs.promises.writeFile(this.file, JSON.stringify(this.orders, null, 2));
    const createdOrder = returnOrders(order);
    return createdOrder;
  }

  find(id) {
    const orderFound = this.orders.filter((order) => order.id === id);
    if (orderFound) {
      return returnOrders(orderFound[0]);
    }
    throw new Error('Order not found');
  }

  getAll() {
    let orders;
    try {
      this.orders = fs.readFileSync(this.file, 'utf-8');
      this.orders = JSON.parse(this.orders);
      orders = returnOrders(this.orders);
    } catch (err) {
      this.log.warn('file not created yet, creating new one');
    }
    return orders || [];
  }

  async delete(id) {
    try {
      this.orders = fs.readFileSync(this.file, 'utf-8');
      this.orders = JSON.parse(this.orders).filter((order) => order.id !== id);
      fs.writeFileSync(this.file, JSON.stringify(this.orders, null, 2));
      return true;
    } catch (err) {
      this.logger.error(err);
      return true;
    }
  }

  async update(id, data) {
    const orderFound = this.orders.findIndex((order) => order.id === id);
    if (orderFound >= 0) {
      // eslint-disable-next-line no-param-reassign
      data.id = id;
      this.orders[orderFound] = data;
      await fs.promises.writeFile(this.file, JSON.stringify(this.orders, null, 2));
      return this.orders[orderFound];
    }
    throw new Error('Order not found');
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new OrderDaoFile(logger);
    return instance;
  }
}

module.exports = OrderDaoFile;

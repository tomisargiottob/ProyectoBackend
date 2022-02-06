/* eslint-disable no-underscore-dangle */
const { v4: uuid } = require('uuid');
const OrderDao = require('./order-dao');
const returnOrders = require('./order-dto');

let instance;

class OrderDaoMemory extends OrderDao {
  constructor(logger) {
    super(logger);
    this.orders = [];
  }

  async getAll() {
    return this.orders;
  }

  async find(id) {
    const foundOrder = this.orders.find((order) => {
      if (order.id === id) {
        return order;
      }
      return false;
    });
    if (foundOrder) {
      return returnOrders(foundOrder);
    }
    throw new Error('order not found');
  }

  async update(id, data) {
    const index = this.orders.findIndex((order) => {
      if (order.id === id) {
        return order;
      }
      return false;
    });
    if (index >= 0) {
      this.orders[index] = data;
      this.orders[index].id = id;
      return returnOrders(this.orders[index]);
    }
    throw new Error('Order not found');
  }

  async delete(id) {
    this.orders = this.orders.filter((order) => order.id !== id);
    return true;
  }

  async create(data) {
    const order = {
      id: uuid(),
      user: data.user,
      status: data.status,
      deliveryDate: data.deliveryDate,
      products: data.products,
    };
    this.orders.push(order);
    return returnOrders(this.orders);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new OrderDaoMemory(logger);
    return instance;
  }
}

module.exports = OrderDaoMemory;

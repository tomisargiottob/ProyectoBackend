/* eslint-disable class-methods-use-this */
const OrderDao = require('./order-dao');
const OrderModel = require('../../models/order-model');
const returnOrders = require('./order-dto');

let instance;

class OrderDaoMongo extends OrderDao {
  async getAll() {
    const ordersMongo = await OrderModel.find();
    const orders = returnOrders(ordersMongo);
    return orders;
  }

  async find(id) {
    let order;
    try {
      order = await OrderModel.find({ id });
      if (order) {
        return returnOrders(order);
      }
    } catch (err) {
      throw new Error('Error looking for Order');
    }
    throw new Error('Order not found');
  }

  async update(id, data) {
    // eslint-disable-next-line no-param-reassign
    data.id = id;
    const order = await OrderModel.findOneAndUpdate(id, data, { new: true });
    if (order) {
      return returnOrders(order);
    }
    throw new Error('Order not found');
  }

  async delete(id) {
    await OrderModel.findOneAndRemove(id);
  }

  async create(data) {
    const order = await OrderModel.create(data);
    return returnOrders(order);
  }

  static getInstance(logger) {
    if (instance) {
      logger.info('devuelvo la instancia ya existente');
      return instance;
    }
    instance = new OrderDaoMongo(logger);
    return instance;
  }
}

module.exports = OrderDaoMongo;

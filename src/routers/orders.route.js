const { Router } = require('express');
const {
  getOrders,
} = require('../controllers/order.controller');

const orderRouter = new Router();

orderRouter.get('', getOrders);

module.exports = { orderRouter };

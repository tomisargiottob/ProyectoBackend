const { Router } = require('express');
const checkAuthenticated = require('../middleware/auth.middleware');

const {
  getOrders,
} = require('../controllers/order.controller');

const orderRouter = new Router();

orderRouter.get('', checkAuthenticated, getOrders);

module.exports = { orderRouter };

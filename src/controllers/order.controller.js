const OrderDaoFactory = require('../services/order/order-factory');
const logger = require('../utils/logger');

const OrderDao = OrderDaoFactory.getDao();
const log = logger.child({ module: 'Order controller' });

async function getOrders(req, res) {
  const where = {};
  const { id } = req.params;
  if (id) {
    where.id = id;
  }
  try {
    if (req.user.role !== 'admin') {
      res.status(401).send({ message: 'Unauthorized request to get all orders' });
    }
    log.info('Searching all orders');
    const allOrders = await OrderDao.getAll();
    res.status(200).send(allOrders);
    log.info('All orders sent');
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = {
  getOrders,
};

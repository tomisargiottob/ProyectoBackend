const UserDaoFactory = require('../services/user/user-factory');
const OrderDaoFactory = require('../services/order/order-factory');
const { createHash } = require('../utils/crypto');

const logger = require('../utils/logger');

const UserDao = UserDaoFactory.getDao();
const OrderDao = OrderDaoFactory.getDao();

const log = logger.child({ module: 'User controller' });

async function findUser(req, res) {
  const { id } = req.params;
  try {
    log.info({ id }, 'Searching user');
    const userFound = await UserDao.find({ id });
    delete userFound.password;
    if (!userFound) {
      log.info({ id }, 'User Not found');
      return res.status(404).json({ message: 'user not found' });
    }
    if (req.user.username !== userFound.username && req.user.role !== 'admin') {
      return res.status(401).send({ message: 'Unauthorized request to find user ' });
    }
    log.info({ id }, 'User Information sent');
    return res.status(200).json(userFound);
  } catch (err) {
    log.error({ id }, err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const update = req.body;
  try {
    const userFound = await UserDao.find({ id });
    if (req.user.username !== userFound.username && req.user.role !== 'admin') {
      return res.status(401).send({ message: 'Unauthorized request to update user' });
    }
    if (!userFound) {
      log.info({ id }, 'User Not found');
      return res.status(404).json({ message: 'user not found' });
    }
    log.info({ id }, 'Updating User Information');
    if (update.password) {
      update.password = createHash(update.password);
    }
    const data = { ...userFound, ...update };
    const userUpdated = await UserDao.update(id, { ...data });
    delete userUpdated.password;
    log.info({ id }, 'User Information updated');
    return res.status(200).json(userUpdated);
  } catch (err) {
    log.error({ id }, err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function findUserOrders(req, res) {
  const { id } = req.params;
  try {
    const userFound = await UserDao.find({ id });
    if (req.user.username !== userFound.username && req.user.role !== 'admin') {
      return res.status(401).send({ message: 'Unauthorized request to update user' });
    }
    log.info({ id }, 'Searching user');
    const ordersFound = await OrderDao.getAll({ user: id });
    if (!ordersFound) {
      log.info({ id }, 'User has no orders');
      return res.status(404).json({ message: 'user not found' });
    }
    log.info({ id }, 'User orders Information sent');
    return res.status(200).json(ordersFound);
  } catch (err) {
    log.error({ id }, err.message);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { findUser, updateUser, findUserOrders };

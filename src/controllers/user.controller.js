const UserDaoFactory = require('../services/user/user-factory');
const logger = require('../utils/logger');

const UserDao = UserDaoFactory.getDao();

const log = logger.child({ module: 'User controller' });

async function findUser(req, res) {
  const { id } = req.params;
  try {
    log.info({ id }, 'Searching user');
    const userFound = await UserDao.find({ id });
    delete userFound.password;
    if (!userFound) {
      log.info({ id }, 'User Not found');
      return res.status(200).json({ message: 'user not found' });
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
    log.info({ id }, 'Updating User Information');
    const userUpdated = await UserDao.update(id, { ...update });
    res.status(200).json(userUpdated);
    log.info({ id }, 'User Information updated');
  } catch (err) {
    res.status(500).json({ message: err.message });
    log.error({ id }, err.message);
  }
}

module.exports = { findUser, updateUser };

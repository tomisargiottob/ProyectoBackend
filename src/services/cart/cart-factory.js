const minimist = require('minimist');
const CartDaoFile = require('./cartFile-dao');
const CartDaoMongo = require('./cartMongo-dao');
const CartDaoMemory = require('./cartMemory-dao');
const logger = require('../../utils/logger');

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  logger.info(`The DAO in ${option} option was selected`);
} else {
  logger.info('Default mode DAO in memory selected');
}
let dao;

class CartDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = CartDaoMongo.getInstance(logger);
    } else if (option === 'file') {
      dao = CartDaoFile.getInstance(logger);
    } else {
      dao = CartDaoMemory.getInstance(logger);
    }
    return dao;
  }
}

module.exports = CartDaoFactory;

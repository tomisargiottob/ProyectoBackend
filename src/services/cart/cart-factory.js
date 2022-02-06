const minimist = require('minimist');
const CartDaoFile = require('./cartFile-dao');
const CartDaoMongo = require('./cartMongo-dao');
const CartDaoMemory = require('./cartMemory-dao');
const logger = require('../../utils/logger');

const args = minimist(process.argv.slice(2));
const log = logger.child({ module: 'Cart Factory' });

const option = args.d;
if (option) {
  log.info(`The DAO in ${option} option was selected`);
} else {
  log.info('Default mode DAO in memory selected');
}
let dao;

class CartDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = CartDaoMongo.getInstance(log);
    } else if (option === 'file') {
      dao = CartDaoFile.getInstance(log);
    } else {
      dao = CartDaoMemory.getInstance(log);
    }
    return dao;
  }
}

module.exports = CartDaoFactory;

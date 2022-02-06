const minimist = require('minimist');
const OrderDaoFile = require('./orderFile-dao');
const OrderDaoMongo = require('./orderMongo-dao');
const OrderDaoMemory = require('./orderMemory-dao');
const logger = require('../../utils/logger');

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  logger.info(`The DAO in ${option} option was selected`);
} else {
  logger.info('Default mode DAO in memory selected');
}
let dao;

class OrderDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = OrderDaoMongo.getInstance(logger);
    } else if (option === 'file') {
      dao = OrderDaoFile.getInstance(logger);
    } else {
      dao = OrderDaoMemory.getInstance(logger);
    }
    return dao;
  }
}

module.exports = OrderDaoFactory;

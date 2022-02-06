const minimist = require('minimist');
const OrderDaoFile = require('./orderFile-dao');
const OrderDaoMongo = require('./orderMongo-dao');
const OrderDaoMemory = require('./orderMemory-dao');
const logger = require('../../utils/logger');

const log = logger.child({ module: 'Order Factory' });

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  log.info(`The DAO in ${option} option was selected`);
} else {
  log.info('Default mode DAO in memory selected');
}
let dao;

class OrderDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = OrderDaoMongo.getInstance(log);
    } else if (option === 'file') {
      dao = OrderDaoFile.getInstance(log);
    } else {
      dao = OrderDaoMemory.getInstance(log);
    }
    return dao;
  }
}

module.exports = OrderDaoFactory;

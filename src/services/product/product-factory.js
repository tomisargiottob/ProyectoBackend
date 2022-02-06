const minimist = require('minimist');
const ProductDaoFile = require('./productFile-dao');
const ProductDaoMongo = require('./productMongo-dao');
const ProductDaoMemory = require('./productMemory-dao');
const logger = require('../../utils/logger');

const log = logger.child({ module: 'Product Factory' });

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  log.info(`The DAO in ${option} option was selected`);
} else {
  log.info('Default mode DAO in memory selected');
}
let dao;

class ProductDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = ProductDaoMongo.getInstance(log);
    } else if (option === 'file') {
      dao = ProductDaoFile.getInstance(log);
    } else {
      dao = ProductDaoMemory.getInstance(log);
    }
    return dao;
  }
}

module.exports = ProductDaoFactory;

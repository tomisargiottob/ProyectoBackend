const minimist = require('minimist');
const ProductDaoFile = require('./productFile-dao');
const ProductDaoMongo = require('./productMongo-dao');
const ProductDaoMemory = require('./productMemory-dao');
const logger = require('../../utils/logger');

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  logger.info(`The DAO in ${option} option was selected`);
} else {
  logger.info('Default mode DAO in memory selected');
}
let dao;

class ProductDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = ProductDaoMongo.getInstance(logger);
    } else if (option === 'file') {
      dao = ProductDaoFile.getInstance(logger);
    } else {
      dao = ProductDaoMemory.getInstance(logger);
    }
    return dao;
  }
}

module.exports = ProductDaoFactory;

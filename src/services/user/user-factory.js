const minimist = require('minimist');
const UserDaoFile = require('./userFile-dao');
const UserDaoMongo = require('./userMongo-dao');
const UserDaoMemory = require('./userMemory-dao');
const logger = require('../../utils/logger');

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  logger.info(`The DAO in ${option} option was selected`);
} else {
  logger.info('Default mode DAO in memory selected');
}
let dao;

class UserDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = UserDaoMongo.getInstance(logger);
    } else if (option === 'file') {
      dao = UserDaoFile.getInstance(logger);
    } else {
      dao = UserDaoMemory.getInstance(logger);
    }
    return dao;
  }
}

module.exports = UserDaoFactory;

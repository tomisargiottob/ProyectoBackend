const minimist = require('minimist');
const UserDaoFile = require('./userFile-dao');
const UserDaoMongo = require('./userMongo-dao');
const UserDaoMemory = require('./userMemory-dao');
const logger = require('../../utils/logger');

const log = logger.child({ module: 'User Factory' });

const args = minimist(process.argv.slice(2));

const option = args.d;
if (option) {
  log.info(`The DAO in ${option} option was selected`);
} else {
  log.info('Default mode DAO in memory selected');
}
let dao;

class UserDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = UserDaoMongo.getInstance(log);
    } else if (option === 'file') {
      dao = UserDaoFile.getInstance(log);
    } else {
      dao = UserDaoMemory.getInstance(log);
    }
    return dao;
  }
}

module.exports = UserDaoFactory;

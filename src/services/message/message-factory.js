const minimist = require('minimist');
const MessageDaoFile = require('./messageFile-dao');
const MessageDaoMongo = require('./messageMongo-dao');
const MessageDaoMemory = require('./messageMemory-dao');
const logger = require('../../utils/logger');

const args = minimist(process.argv.slice(2));
const log = logger.child({ module: 'Message Factory' });

const option = args.d;
if (option) {
  log.info(`The DAO in ${option} option was selected`);
} else {
  log.info('Default mode DAO in memory selected');
}
let dao;

class MessageDaoFactory {
  static getDao() {
    if (option === 'mongo') {
      dao = MessageDaoMongo.getInstance(log);
    } else if (option === 'file') {
      dao = MessageDaoFile.getInstance(log);
    } else {
      dao = MessageDaoMemory.getInstance(log);
    }
    return dao;
  }
}

module.exports = MessageDaoFactory;

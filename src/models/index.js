const mongoose = require('mongoose');

class Database {
  constructor({ logger, uri }) {
    this.logger = logger.child({ module: 'Database' });
    this.uri = uri;
  }

  connect() {
    const log = this.logger.child({ method: 'connect' });
    mongoose.connect(
      this.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      (err) => {
        if (err) {
          log.error(err);
        } else {
          log.info('connected to db');
        }
      },
    );
  }
}

module.exports = Database;

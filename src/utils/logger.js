const config = require('config');
const pino = require('pino');

const formatters = {
  bindings() {
    return {};
  },
  level(label) {
    return { level: label };
  },
};

const logger = pino({
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  formatters,
  level: (config.logger && config.logger.level) || 'debug',
});

module.exports = logger;

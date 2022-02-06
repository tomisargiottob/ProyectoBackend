const logger = require('../utils/logger');

const checkAuthenticated = (req, res, next) => {
  next();
  // if (req.isAuthenticated()) {
  //   next();
  // } else {
  //   logger.info('Unauthorized request denied');
  //   res.status(401).json({ message: 'Unauthorized' });
  // }
};

module.exports = checkAuthenticated;

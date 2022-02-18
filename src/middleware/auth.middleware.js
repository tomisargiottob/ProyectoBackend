const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const checkAuthenticated = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ error: 'Missing auth-token' });
  try {
    const verified = jwt.verify(token, process.env.SESSIONSECRET);
    logger.info('User authorized');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'The given token is not valid' });
  }
};

module.exports = checkAuthenticated;

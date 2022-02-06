const logger = require('../utils/logger');

const log = logger.child({ module: 'Auth controller' });

function postSignup(req, res) {
  res.status(200).json({ message: 'User succesfully signed up' });
}

function failedSignup(req, res) {
  res.status(400).json({ message: 'User could not sign up' });
}

function postLogin(req, res) {
  // eslint-disable-next-line no-underscore-dangle
  res.status(200).json({ id: (req.user && req.user.id), message: 'Login succesfull' });
}

function postLogout(req, res) {
  try {
    req.logout();
    res.clearCookie('connect.sid').status(204);
  } catch (err) {
    log.warn(err.message);
    res.status(500).json({ message: 'Server could not resolve logout' });
  }
}

module.exports = {
  postLogin,
  postSignup,
  postLogout,
  failedSignup,
};

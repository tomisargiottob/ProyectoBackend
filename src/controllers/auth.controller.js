// const path = require('path');
const logger = require('../utils/logger');

function postSignup(req, res) {
  res.status(200).json({ message: 'User succesfully signed up' });
}
function postLogin(req, res) {
  res.status(200).json({ message: 'Login succesfull' });
}

// function getLogin(req, res) {
//   if (req.isAuthenticated()) {
//     res.status(200).json({ message: 'Login succesfull' });
//   } else {
//     logger.info('Usuario no logeado');
//     res.status(401).json({ message: 'User not logged in' });
//   }
// }
module.exports = {
  postLogin,
  postSignup,
};

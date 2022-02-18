const bcrypt = require('bcrypt');

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

function isValidPasword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

module.exports = { createHash, isValidPasword };

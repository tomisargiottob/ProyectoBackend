const jwt = require('jsonwebtoken');
const UserDaoFactory = require('../services/user/user-factory');
const CartDaoFactory = require('../services/cart/cart-factory');
const sendEmail = require('./mailer');
const logger = require('./logger');
const { createHash, isValidPasword } = require('./crypto');

const UserDao = UserDaoFactory.getDao();
const CartDao = CartDaoFactory.getDao();

const log = logger.child({ module: 'jwtAuth' });

async function login(username, password) {
  try {
    const user = await UserDao.find({ username });
    if (!user) {
      log.info('no existe el usuario');
      throw new Error('404');
    }
    if (!isValidPasword(user, password)) {
      log.info('invalid password');
      throw new Error('401');
    }
    log.info('login succesfully');
    const payload = {
      id: user.id,
      username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.SESSIONSECRET, {
      expiresIn: process.env.SESSIONEXPIRATION,
    });
    return { token, user };
  } catch (err) {
    log.error({ user: username }, 'error trying to log in');
    throw err;
  }
}

async function signup(data) {
  const {
    username,
    password,
    name,
    surname,
    address,
    age,
    telephone,
    role,
    avatar,
  } = data;
  try {
    const user = await UserDao.find({ username });
    if (user) {
      log.info('usuario existe');
      throw new Error({ message: 'usuario existe', code: 400 });
    }
  } catch (err) {
    log.error(err);
    throw err;
  }
  const newUser = {
    username,
    name,
    surname,
    password: createHash(password),
    address,
    age,
    telephone,
    avatar,
    role: role || 'customer',
  };
  try {
    const createdUser = await UserDao.create(newUser);
    log.info('usuario creado');
    await CartDao.create({ products: [], user: createdUser.id });
    log.info('Se ha creado un carrito para el usuario ');

    sendEmail({ subject: 'Nuevo Registro', html: `<h1>Nuevo usuario creado </h1><p> Se ha registrado un nuevo usuario ${JSON.stringify(newUser)}</p>`, to: 'admin' });
    const payload = {
      id: createdUser.id,
      username,
      role: createdUser.role,
    };
    const token = jwt.sign(payload, process.env.SESSIONSECRET, {
      expiresIn: process.env.SESSIONEXPIRATION,
    });
    return token;
  } catch (err) {
    log.error('Could not create user', err.message);
    throw err;
  }
}

module.exports = { login, signup };

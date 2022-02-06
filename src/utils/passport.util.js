const passport = require('passport');
// const { Strategy } = require('passport-facebook');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserDaoFactory = require('../services/user/user-factory');
const CartDaoFactory = require('../services/cart/cart-factory');
const sendEmail = require('./mailer');
const logger = require('./logger');

const UserDao = UserDaoFactory.getDao();
const CartDao = CartDaoFactory.getDao();

const log = logger.child({ module: 'passport' });
function isValidPasword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

passport.use('login', new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (username, password, done) => {
    try {
      const user = await UserDao.find({ username });
      if (!user) {
        log.info('no existe el usuario');
        return done(null, false, { message: 'No existe un usuario registrado con ese correo', code: 404 });
      }
      if (!isValidPasword(user, password)) {
        log.info('invalid password');
        return done(null, false, { message: 'Contraseña incorrecta', code: 401 });
      }
      log.info('login succesfully');
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
}, async (req, username, password, done) => {
  let createdCart = {};
  const { address, age, telephone } = req.body;
  try {
    const user = await UserDao.find({ username });
    if (user) {
      log.info('usuario existe');
      return done(null, false, { message: 'usuario existe', code: 400 });
    }
  } catch (err) {
    log.error(err);
    return done(err);
  }
  const newUser = {
    username,
    password: createHash(password),
    address,
    age,
    telephone,
    avatar: req.file?.originalname,
  };
  try {
    const createdUser = await UserDao.create(newUser);
    log.info('usuario creado');
    await CartDao.create({ products: [], user: createdUser.id });
    log.info('Se ha creado un carrito para el usuario ');

    sendEmail({ subject: 'Nuevo Registro', html: `<h1>Nuevo usuario creado </h1><p> Se ha registrado un nuevo usuario ${JSON.stringify(newUser)}</p>`, to: 'admin' });
    return done(null, createdUser);
  } catch (err) {
    log.error('Could not create user', err.message);
    return done(null, false);
  }
}));

passport.serializeUser((user, done) => {
  // eslint-disable-next-line no-underscore-dangle
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserDao.find({ id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = { passport };

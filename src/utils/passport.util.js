const passport = require('passport');
// const { Strategy } = require('passport-facebook');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Cart = require('../models/cart-model');
const UserModel = require('../models/user-model');
const sendEmail = require('./mailer');
const logger = require('./logger');

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
  (username, password, done) => {
    UserModel.findOne({ username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        log.info('no existe el usuario');
        return done(null, false);
      }
      if (!isValidPasword(user, password)) {
        log.info('invalid password');
        return done(null, false);
      }
      log.info('login succesfully');
      return done(null, user);
    });
  },
));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
}, async (req, username, password, done) => {
  let createdCart = {};
  const { address, age, telephone } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      log.info('usuario existe');
      return done(null, false, { message: 'usuario existe' });
    }
    createdCart = await Cart.create({ products: [] });
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
    // eslint-disable-next-line no-underscore-dangle
    cart: createdCart._id,
  };
  try {
    const createdUser = await UserModel.create(newUser);
    log.info('usuario creado');
    sendEmail({ subject: 'Nuevo Registro', html: `<h1>Nuevo usuario creado </h1><p> Se ha registrado un nuevo usuario ${JSON.stringify(newUser)}</p>`, to: 'admin' });
    return done(null, createdUser);
  } catch (err) {
    log.error('Could not create user', err.message);
    return done(null, false);
  }
}));

passport.serializeUser((user, done) => {
  // eslint-disable-next-line no-underscore-dangle
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  UserModel.findById(id, done);
});

module.exports = { passport };

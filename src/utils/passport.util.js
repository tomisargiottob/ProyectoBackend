const passport = require('passport');
// const { Strategy } = require('passport-facebook');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model');
const sendEmail = require('./mailer');

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
        console.log('no existe el usuario');
        return done(null, false);
      }
      if (!isValidPasword(user, password)) {
        console.log('invalid password');
        return done(null, false);
      }
      return done(null, user);
    });
  },
));

passport.use('signup', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
}, async (req, username, password, done) => {
  console.log(username);
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      console.log('usuario existe');
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
  const newUser = {
    username,
    password: createHash(password),
    ...req.body,
    avatar: req.file?.originalname,
  };
  try {
    const createdUser = await UserModel.create(newUser);
    console.log('usuario creado');
    sendEmail({ subject: 'Nuevo Registro', html: `<h1>Nuevo usuario creado </h1><p> Se ha registrado un nuevo usuario ${JSON.stringify(newUser)}</p>`, to: 'admin' });
    return done(null, createdUser);
  } catch (err) {
    console.log('Could not create user', err.message);
    return done(null, false);
  }
}));

passport.serializeUser((user, done) => {
  // eslint-disable-next-line no-underscore-dangle
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  UserModel.findById(id, done);
  // done(null, id);
});

module.exports = { passport };

const logger = require('../utils/logger');
const { login, signup } = require('../utils/jwtAuth');

const log = logger.child({ module: 'Auth controller' });

async function postSignup(req, res) {
  const userData = {
    username: req.body.email,
    password: req.body.password,
    name: req.body.name,
    surname: req.body.surname,
    address: req.body.adress,
    age: req.body.age,
    telephone: req.body.telephone,
    role: req.body.role,
    avatar: req.file?.originalname,
  };
  if (!userData.username || !userData.password) {
    return res.status(400).json({ message: 'Password and username must be provided' });
  }
  try {
    log.info({ username: userData.username }, 'Signing up new User');
    const token = await signup(userData);
    log.info({ username: userData.username }, 'User successfully Signed up');
    return res.header('auth-token', token).status(200).json({
      data: userData,
      token,
    });
  } catch (err) {
    if (err.code && err.code === 400) {
      log.info({ username: userData.username, error: err.code }, 'User could not be loged in');
      return res.status(400).json({ message: err.message });
    }
    log.error({ username: userData.username, error: err.message }, 'Error trying to sign up user');
    return res.status(500).json({ message: err.message });
  }
}

// function failedSignup(req, res) {
//   res.status(400).json({ message: 'User could not sign up' });
// }

async function postLogin(req, res) {
  const { email, password } = req.body;
  log.info({ email }, 'User logging in');
  try {
    const { token, user } = await login(email, password);
    delete user.password;
    log.info({ email }, 'User successfully loged in');
    return res.header('auth-token', token).status(200).json({
      user,
      token,
    });
  } catch (err) {
    if (err.message === '401') {
      log.info({ email, error: 'Wrong password' }, 'User could not be loged in');
      return res.status(401).json({ message: 'Wrong password' });
    }
    if (err.message === '404') {
      log.info({ email, error: 'User not found' }, 'User could not be loged in');
      return res.status(404).json({ message: 'User not found' });
    }
    log.error({ email, error: err.message }, 'Error trying to log in user');
    return res.status(500).json({ message: err.message });
  }
}

// function postLogout(req, res) {
//   try {
//     req.logout();
//     res.clearCookie('connect.sid').status(204);
//   } catch (err) {
//     log.warn(err.message);
//     res.status(500).json({ message: 'Server could not resolve logout' });
//   }
// }

module.exports = {
  postLogin,
  postSignup,
};

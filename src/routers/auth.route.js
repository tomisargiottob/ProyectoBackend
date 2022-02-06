const express = require('express');
const multer = require('multer');
const { passport } = require('../utils/passport.util');
const {
  postSignup,
  postLogin,
  postLogout,
  failedSignup,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/api/auth/login', passport.authenticate('login', {}), postLogin);
// router.post('/api/auth/login', passport.authenticate('login', (err, user, info) => {
//   if (err) {
//     res.status(500).json(err);
//   } else if (info) {
//     res.status(info.code).json(info);
//   }
//   next();
//   }), postLogin);

router.post('/api/auth/logout', postLogout);
router.get('/api/auth/signup/denied', failedSignup);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post('/api/user', upload.single('avatar'), (req, res) => {
  passport.authenticate('signup', (err, user, info) => {
    if (err) {
      res.status(500).json(err);
    } else if (info) {
      res.status(info.code).json(info);
    } else if (user) {
      postSignup(req, res);
    }
  })(req, res);
});

module.exports = { router };

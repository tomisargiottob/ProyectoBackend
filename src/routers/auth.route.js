const express = require('express');
const multer = require('multer');
const { passport } = require('../utils/passport.util');
const {
  postSignup,
  postLogin,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/api/login', passport.authenticate('login', {}), postLogin);
router.post('/api/logout', (req, res) => {
  req.logout();
  res.clearCookie('connect.sid').status(204);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post('/api/user', upload.single('avatar'), passport.authenticate('signup', {}), postSignup);


module.exports = { router };

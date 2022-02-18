const express = require('express');
const multer = require('multer');
const {
  postSignup,
  postLogin,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/api/auth/login', postLogin);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post('/api/user', upload.single('avatar'), postSignup);

module.exports = { router };

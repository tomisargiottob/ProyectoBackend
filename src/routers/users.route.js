const { Router } = require('express');
const multer = require('multer');
const {
  findUser,
  updateUser,
} = require('../controllers/user.controller');
const checkAuthenticated = require('../middleware/auth.middleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const userRouter = new Router();

userRouter.get('/:id', checkAuthenticated, findUser);
userRouter.put('/:id', checkAuthenticated, upload.single('avatar'), updateUser);

module.exports = { userRouter };

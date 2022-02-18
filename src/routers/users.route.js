const { Router } = require('express');
const multer = require('multer');
const {
  findUser,
  updateUser,
  findUserOrders,
} = require('../controllers/user.controller');
const {
  getMessages,
} = require('../controllers/message.controller');
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
userRouter.patch('/:id', checkAuthenticated, upload.single('avatar'), updateUser);
userRouter.get('/:id/orders', checkAuthenticated, findUserOrders);
userRouter.get('/:id/messages', checkAuthenticated, getMessages);

module.exports = { userRouter };

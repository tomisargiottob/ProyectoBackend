const { Router } = require('express');
const multer = require('multer');
const checkAuthenticated = require('../middleware/auth.middleware');
const User = require('../models/user-model');
const logger = require('../utils/logger');

const log = logger.child({ module: 'Cart controller' });

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

userRouter.get('/:id', checkAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    log.info({ id }, 'Searching user');
    const userFound = await User.findOne({ _id: id });
    if (!userFound) {
      log.info({ id }, 'User Not found');
      return res.status(200).json({ message: 'user not found' });
    }
    log.info({ id }, 'User Information sent');
    return res.status(200).json(userFound);
  } catch (err) {
    log.error({ id }, err.message);
    return res.status(500).json({ message: err.message });
  }
});

userRouter.patch('/:id', checkAuthenticated, upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    log.info({ id }, 'Updating User Information');
    const userUpdated = await User.findOneAndUpdate({ _id: id }, { ...update }, { new: true });
    res.status(200).json(userUpdated);
    log.info({ id }, 'User Information updated');
  } catch (err) {
    res.status(500).json({ message: err.message });
    log.error({ id }, err.message);
  }
});

module.exports = { userRouter };

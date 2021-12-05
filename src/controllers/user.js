const { Router } = require('express');
const multer = require('multer');
const checkAuthenticated = require('../middleware/auth.middleware');
const User = require('../models/user-model');

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
    const userFound = await User.find({ _id: id });
    res.status(200).send(userFound);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

userRouter.patch('/:id', checkAuthenticated, upload.single('avatar'), async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  try {
    const userUpdated = await User.findOneAndUpdate({ _id: id }, { ...update }, { new: true });
    res.status(200).send(userUpdated);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = { userRouter };

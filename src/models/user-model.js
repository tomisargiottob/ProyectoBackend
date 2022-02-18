const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const Schema = mongoose.Schema({
  id: {
    type: String,
    default: function genUUID() {
      return uuid();
    },
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  surname: {
    type: String,
  },
  cart: {
    type: String,
  },
  address: {
    type: String,
  },
  age: {
    type: Number,
  },
  telephone: {
    type: Number,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
  },
});

module.exports = mongoose.model('user', Schema);

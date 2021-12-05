const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const Schema = mongoose.Schema({
  _id: {
    type: String,
    default: function genUUID() {
      return uuid();
    },
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  code: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('product', Schema);

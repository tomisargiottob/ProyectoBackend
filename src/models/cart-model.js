const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const Schema = mongoose.Schema({
  id: {
    type: String,
    default: function genUUID() {
      return uuid();
    },
  },
  products: [{
    id: {
      type: String,
      required: true,
    },
    ammount: {
      type: Number,
      required: true,
    },
  }],
  user: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('cart', Schema);

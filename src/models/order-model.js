const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const Schema = mongoose.Schema({
  _id: {
    type: String,
    default: function genUUID() {
      return uuid();
    },
  },
  user: {
    type: String,
  },
  products: [{
    _id: String,
    ammount: Number,
  }],
  status: {
    type: String,
  },
  deliveryDate: {
    type: String,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('order', Schema);

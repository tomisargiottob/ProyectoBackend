const mongoose = require('mongoose');

const Schema = mongoose.Schema({
  id: {
    type: String,
  },
  products: [{
    id: String,
    name: String,
    description: String,
    code: String,
    thumbnail: String,
    price: Number,
    stock: Number,
    amount: Number,
  }],
},
{
  timestamps: true,
});

module.exports = mongoose.model('cart', Schema);

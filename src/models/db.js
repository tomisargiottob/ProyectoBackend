const config = require('config');
const mongoose = require('mongoose');

mongoose.connect(
  config.db.uriAtlas, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('connected to db');
    }
  },
);

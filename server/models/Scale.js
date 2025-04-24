const mongoose = require('mongoose');

const scaleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Scale = mongoose.model('Scale', scaleSchema);

module.exports = Scale;

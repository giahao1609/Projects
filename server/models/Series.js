const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Series = mongoose.model('Series', seriesSchema);

module.exports = Series;

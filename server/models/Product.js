const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true 
  },

  detailDescription: {
    type: String,
    required: true 
  },

  oldPrice: {
    type: Number,
    required: true
  },

  discountPrice: {
    type: Number,
    required: true
  },

  category: {
    type: String, 
    required: true
  },

  brand: {
    type: String, 
    required: true
  },

  series: {
    type: String, 
    required: true
  },

  ratio: {
    type: String, 
    required: true
  },

  scale: {
    type: String, 
    required: true
  },

  stock: {
    type: Number,
    required: true
  },

  image: {
    type: String, 
    required: true
  },

  gallery: {
    type: [String], 
    required: false
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

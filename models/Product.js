const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isSold: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Product', productSchema);

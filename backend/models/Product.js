const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  category: {
  type: String,
  required: true,
  enum: ['Men', 'Women', 'Kids', 'Accessories', 'Fragrances']  
},
  subCategory: { type: String },
  images: [{ public_id: String, url: String }],
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
  colors: [{ name: String, hex: String }],
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
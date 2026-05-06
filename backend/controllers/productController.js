const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const { keyword, category, size, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
  const query = {};
  if (keyword) query.name = { $regex: keyword, $options: 'i' };
  if (category) query.category = category;
  if (size) query.sizes = size;
  if (minPrice || maxPrice) query.price = {
    ...(minPrice && { $gte: Number(minPrice) }),
    ...(maxPrice && { $lte: Number(maxPrice) })
  };
  const sortObj = sort === 'price-asc' ? { price: 1 }
    : sort === 'price-desc' ? { price: -1 }
    : sort === 'rating' ? { rating: -1 }
    : { createdAt: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortObj)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  res.json({ products, total, pages: Math.ceil(total / limit), page });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
};

exports.createReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });
  product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  await product.save();
  res.status(201).json({ message: 'Review added' });
};

exports.getFeatured = async (req, res) => {
  const products = await Product.find({ featured: true }).limit(8);
  res.json(products);
};

exports.getTrending = async (req, res) => {
  const products = await Product.find({ trending: true }).limit(8);
  res.json(products);
};
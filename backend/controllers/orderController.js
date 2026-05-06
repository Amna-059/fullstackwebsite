const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
  if (!orderItems?.length) return res.status(400).json({ message: 'No order items' });
  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress,
    paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice
  });
  // Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, sold: item.quantity }
    });
  }
  res.status(201).json(order);
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(orders);
};

exports.updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  const updated = await order.save();
  res.json(updated);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.status = req.body.status;
  if (req.body.status === 'Delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
  const updated = await order.save();
  res.json(updated);
};
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

router.get('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.json(user);
});

router.delete('/:id', protect, admin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Ye route add karo
router.put('/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isAdmin = req.body.isAdmin;
  await user.save();
  res.json({ message: 'User updated' });
});

// Wishlist
router.post('/wishlist/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(req.params.productId);
  await user.save();
  res.json(user.wishlist);
});

module.exports = router;
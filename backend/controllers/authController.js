const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password });
  res.status(201).json({
    _id: user._id, name: user.name, email: user.email,
    isAdmin: user.isAdmin, token: generateToken(user._id)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({
    _id: updated._id, name: updated.name, email: updated.email,
    isAdmin: updated.isAdmin, token: generateToken(updated._id)
  });
};
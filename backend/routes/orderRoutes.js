const express = require('express');
const router = express.Router();
const { createOrder, getOrder, getUserOrders, updateOrderToPaid, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
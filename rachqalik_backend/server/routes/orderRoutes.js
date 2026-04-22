const express = require('express');
const { createOrder, getOrdersByUser, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/user/:id', protect, getOrdersByUser);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;

const express = require('express');
const { createOrder, getOrdersByUser } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/user/:id', protect, getOrdersByUser);

module.exports = router;

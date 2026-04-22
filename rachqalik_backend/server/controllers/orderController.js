const mongoose = require('mongoose');
const Order = require('../models/Order');

const createOrder = async (req, res, next) => {
  try {
    const { products, total, status } = req.body;

    if (!Array.isArray(products) || products.length === 0 || typeof total !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'products (array) and total (number) are required',
      });
    }

    const order = await Order.create({
      userId: req.user._id,
      products,
      total,
      status: status || 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const canRead = req.user.role === 'admin' || String(req.user._id) === String(id);

    if (!canRead) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrdersByUser };

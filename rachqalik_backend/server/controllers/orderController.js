const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res, next) => {
  try {
    const { products, total, status } = req.body;

    if (!Array.isArray(products) || products.length === 0 || typeof total !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'products (array) and total (number) are required',
      });
    }

    // Validate all productIds exist
    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
      return res.status(400).json({ success: false, message: 'One or more products not found' });
    }

    // Check stock availability
    const productMap = Object.fromEntries(dbProducts.map((p) => [String(p._id), p]));
    for (const item of products) {
      const dbProduct = productMap[String(item.productId)];
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}" (available: ${dbProduct.stock})`,
        });
      }
    }

    const order = await Order.create({
      userId: req.user._id,
      products,
      total,
      status: status || 'pending',
    });

    // Decrement stock for each ordered product
    await Promise.all(
      products.map((item) =>
        Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }),
      ),
    );

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

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const validStatuses = ['pending', 'paid', 'shipped'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Admin can update any order; regular user cannot change status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: admin access required' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrdersByUser, updateOrderStatus };

const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, image, stock } = req.body;

    if (!name || typeof price !== 'number' || !description || typeof stock !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'name, price, description and stock are required',
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price,
      description: description.trim(),
      image: image || '',
      stock,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, createProduct };

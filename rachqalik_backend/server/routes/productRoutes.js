const express = require('express');
const { getProducts, getProductById, createProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.post('/', protect, adminOnly, createProduct);

router.get('/:id', getProductById);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;

const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByBrand,
  getProductsByScale,
  getProductsBySeries
} = require('../controllers/productController');

const router = express.Router();

router.post('/admin-product', authenticateToken, authorizeAdmin, addProduct);

router.get('/products', getProducts);

router.get('/products/:id', getProductById);

router.put('/admin-product/:id', authenticateToken, authorizeAdmin, updateProduct);

router.delete('/admin-product/:id', authenticateToken, authorizeAdmin, deleteProduct);

router.get('/products/search', searchProducts);

router.get('/brands/:brandName', getProductsByBrand);
router.get('/scales/:scaleId', getProductsByScale);
router.get('/series/:seriesId', getProductsBySeries);

module.exports = router;

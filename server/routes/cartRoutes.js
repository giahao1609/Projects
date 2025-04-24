const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, cartController.getCart);
router.post('/', authenticateToken, cartController.addToCart);
router.put('/', authenticateToken, cartController.updateQuantity);
router.delete('/:productId', authenticateToken, cartController.removeFromCart);

module.exports = router;

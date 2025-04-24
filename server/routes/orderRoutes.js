const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const  authenticateToken  = require('../middleware/authenticateToken');

router.post('/', authenticateToken, orderController.createOrder);

router.get('/', authenticateToken, orderController.getMyOrders);

router.get('/:orderId', authenticateToken, orderController.getOrderDetail);

router.put('/:orderId/status', authenticateToken, orderController.updateOrderStatus);

router.put('/:orderId/cancel', authenticateToken, orderController.cancelOrder);


module.exports = router;

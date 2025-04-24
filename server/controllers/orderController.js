const Order = require('../models/order');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm trong đơn hàng' });
    }

    const newOrder = new Order({
      user: req.user.id, // từ authenticateToken
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo đơn hàng', error });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách đơn hàng', error });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product');

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Không có quyền truy cập đơn này' });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết đơn hàng', error });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    order.status = status;
    await order.save();

    res.json({ message: 'Cập nhật trạng thái thành công', order });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái', error });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa đơn này' });
    }

    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: '✅ Đã xóa đơn hàng thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Lỗi khi xóa đơn hàng' });
  }
};

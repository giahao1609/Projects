const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Route tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    console.log('Đang tìm kiếm sản phẩm với tên:', name); // Debug log

    if (!name) {
      return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
    }

    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    })
    .select('name image discountPrice') // Chỉ lấy các trường cần thiết
    .limit(10);

    console.log('Tìm thấy số sản phẩm:', products.length); // Debug log
    res.json(products);
  } catch (error) {
    console.error('Lỗi tìm kiếm:', error);
    res.status(500).json({ message: 'Lỗi tìm kiếm sản phẩm' });
  }
});

module.exports = router; 
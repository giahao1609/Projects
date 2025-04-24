const Product = require('../models/Product'); // Đảm bảo đúng đường dẫn tới model Product
const Cart = require('../models/cart');

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Thông tin không hợp lệ' });
  }

  try {
    // Lấy thông tin sản phẩm từ cơ sở dữ liệu chỉ với các trường cần thiết
    const product = await Product.findById(productId).select('name oldPrice discountPrice scale brand series image');

    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Tìm giỏ hàng của người dùng
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Nếu giỏ hàng không tồn tại, tạo mới giỏ hàng
      cart = new Cart({
        userId: req.user._id,
        items: [{
          productId: product._id,
          quantity,
          name: product.name,
          oldPrice: product.oldPrice,
          discountPrice: product.discountPrice,
          scale: product.scale,
          brand: product.brand,
          series: product.series,
          image: product.image,
        }],
        total: 0
      });
    } else {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const existingIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (existingIndex !== -1) {
        // Nếu sản phẩm đã có, cộng thêm số lượng
        cart.items[existingIndex].quantity += quantity;
      } else {
        // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
        cart.items.push({
          productId: product._id,
          quantity,
          name: product.name,
          oldPrice: product.oldPrice,
          discountPrice: product.discountPrice,
          scale: product.scale,
          brand: product.brand,
          series: product.series,
          image: product.image,
        });
      }
    }

    // Cập nhật tổng tiền của giỏ hàng
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.discountPrice || item.oldPrice) * item.quantity;
    }, 0);

    await cart.save();
    res.status(200).json({ message: '✅ Đã thêm sản phẩm vào giỏ hàng', total: cart.total });
  } catch (err) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const getCart = async (req, res) => {
  try {
    // Lấy giỏ hàng của người dùng với thông tin chi tiết các sản phẩm đã chọn
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ items: [], total: 0 });
    }

    // Tính toán tổng giá trị giỏ hàng (sử dụng giá giảm hoặc giá cũ)
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.discountPrice || item.oldPrice) * item.quantity;
    }, 0);

    res.status(200).json({ items: cart.items, total });
  } catch (err) {
    console.error('Lỗi khi lấy giỏ hàng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    // Lấy giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Kiểm tra xem sản phẩm có trong giỏ hàng không
    const existing = cart.items.some(
      item => item.productId.toString() === productId
    );

    if (!existing) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Loại bỏ sản phẩm khỏi giỏ hàng
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    // Cập nhật lại tổng tiền
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.discountPrice || item.oldPrice) * item.quantity;
    }, 0);

    await cart.save();
    res.status(200).json({ message: '🗑️ Đã xoá sản phẩm khỏi giỏ hàng', total: cart.total });
  } catch (err) {
    console.error('Lỗi khi xoá sản phẩm khỏi giỏ hàng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
  }

  try {
    // Lấy giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
    }

    // Tìm sản phẩm trong giỏ hàng
    const index = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    // Cập nhật lại số lượng sản phẩm
    cart.items[index].quantity = quantity;

    // Cập nhật lại tổng tiền
    cart.total = cart.items.reduce((sum, item) => {
      return sum + (item.discountPrice || item.oldPrice) * item.quantity;
    }, 0);

    await cart.save();

    res.status(200).json({ message: '🔁 Số lượng đã được cập nhật', total: cart.total });
  } catch (err) {
    console.error('Lỗi khi cập nhật số lượng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity
};

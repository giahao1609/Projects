const Product = require('../models/Product');

// Thêm sản phẩm
const addProduct = async (req, res) => {
  const { name, description, oldPrice, discountPrice, category, stock, image, gallery, scale, ratio, series, brand, detailDescription } = req.body;

  if (!name || !oldPrice || !discountPrice || !category || !stock || !image || !scale || !ratio || !series || !brand || !detailDescription) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
  }

  try {
    const newProduct = new Product({
      name,
      description,
      oldPrice,
      discountPrice,
      category,
      stock,
      image,
      gallery, 
      scale,
      ratio,
      series,
      brand,
      detailDescription
    });

    await newProduct.save();
    res.status(201).json({ message: "Sản phẩm đã được thêm thành công", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi thêm sản phẩm", error: err.message });
  }
};

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
  }
};

// Lấy sản phẩm theo id
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, oldPrice, discountPrice, category, stock, image, gallery, scale, ratio, series, brand, detailDescription } = req.body;

  if (!name || !oldPrice || !discountPrice || !category || !stock || !image || !scale || !ratio || !series || !brand || !detailDescription) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc để cập nhật sản phẩm!" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, oldPrice, discountPrice, category, stock, image, gallery, scale, ratio, series, brand, detailDescription },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.status(200).json({ message: "Sản phẩm đã được cập nhật", product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: err.message });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: err.message });
  }
};

// Tìm kiếm sản phẩm theo tên
const searchProducts = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "Tên sản phẩm không được để trống" });
  }

  try {
    const products = await Product.find({
      name: { $regex: name, $options: 'i' }
    });

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tìm kiếm sản phẩm', error: err.message });
  }
};

// Lấy sản phẩm theo thương hiệu
const getProductsByBrand = async (req, res) => {
  try {
    const brandName = decodeURIComponent(req.params.brandName);  // Giải mã thương hiệu
    const products = await Product.find({ brand: brandName });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm cho thương hiệu này" });
    }

    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi khi lấy sản phẩm theo tên thương hiệu",
      error: err.message,
    });
  }
};

// Lấy sản phẩm theo scale
const getProductsByScale = async (req, res) => {
  try {
    const { scaleName } = req.params;
    const products = await Product.find({ scale: scaleName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo series
const getProductsBySeries = async (req, res) => {
  try {
    const { seriesName } = req.params;
    const products = await Product.find({ series: seriesName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm hàm mới để lấy sản phẩm theo tên
const getProductByName = async (req, res) => {
  const { name } = req.params;

  try {
    const product = await Product.findOne({ name: decodeURIComponent(name) });
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByBrand,
  getProductsByScale,
  getProductsBySeries,
  getProductByName
};

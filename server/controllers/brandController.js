const mongoose = require('mongoose');
const Brand = require('../models/Brand');

const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thương hiệu' });
  }
};

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu!' });
    }

    res.json(brand);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin thương hiệu' });
  }
};

const createBrand = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên thương hiệu không được để trống' });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ message: 'Thương hiệu đã tồn tại!' });
    }

    const newBrand = new Brand({ name });
    await newBrand.save();

    res.status(201).json({ message: 'Thương hiệu đã được tạo!', brand: newBrand });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi thêm thương hiệu.' });
  }
};

const updateBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên thương hiệu không được để trống' });
    }

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand && existingBrand._id.toString() !== id) {
      return res.status(400).json({ message: 'Thương hiệu này đã tồn tại!' });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedBrand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu để sửa' });
    }

    res.json({ message: 'Cập nhật thành công', brand: updatedBrand });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thương hiệu' });
  }
};

const deleteBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const deletedBrand = await Brand.findByIdAndDelete(id);

    if (!deletedBrand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu để xóa' });
    }

    res.json({ message: 'Xóa thương hiệu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa thương hiệu' });
  }
};

module.exports = { 
  getAllBrands, 
  getBrandById, 
  createBrand, 
  updateBrandById, 
  deleteBrandById 
};

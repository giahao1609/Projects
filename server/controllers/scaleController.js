import Scale from '../models/Scale.js';

export const getAllScales = async (req, res) => {
  try {
    const scales = await Scale.find().sort({ name: 1 });
    res.json(scales);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách scale' });
  }
};

export const getScaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const scale = await Scale.findById(id);

    if (!scale) {
      return res.status(404).json({ message: 'Không tìm thấy scale!' });
    }

    res.json(scale);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin scale' });
  }
};

export const createScale = async (req, res) => {
  try {
    const { name } = req.body;

    const existingScale = await Scale.findOne({ name });
    if (existingScale) {
      return res.status(400).json({ message: 'Scale này đã tồn tại!' });
    }

    const newScale = new Scale({ name });
    await newScale.save();

    res.status(201).json({ message: 'Scale đã được tạo!', scale: newScale });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo scale' });
  }
};

export const updateScaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingScale = await Scale.findOne({ name });
    if (existingScale) {
      return res.status(400).json({ message: 'Scale này đã tồn tại!' });
    }

    const updatedScale = await Scale.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedScale) {
      return res.status(404).json({ message: 'Không tìm thấy scale để sửa' });
    }

    res.json({ message: 'Cập nhật thành công', scale: updatedScale });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật scale' });
  }
};

export const deleteScaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedScale = await Scale.findByIdAndDelete(id);

    if (!deletedScale) {
      return res.status(404).json({ message: 'Không tìm thấy scale để xóa' });
    }

    res.json({ message: 'Xóa scale thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa scale' });
  }
};

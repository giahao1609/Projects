const Series = require('../models/Series');  

const getAllSeries = async (req, res) => {
  try {
    const series = await Series.find().sort({ name: 1 });
    res.json(series);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách series' });
  }
};

const getSeriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const series = await Series.findById(id);

    if (!series) {
      return res.status(404).json({ message: 'Không tìm thấy series' });
    }

    res.json(series);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin series' });
  }
};

const createSeries = async (req, res) => {
  try {
    const { name } = req.body;

    const existingSeries = await Series.findOne({ name });
    if (existingSeries) {
      return res.status(400).json({ message: 'Series này đã tồn tại!' });
    }

    const newSeries = new Series({ name });
    await newSeries.save();

    res.status(201).json({ message: 'Series đã được tạo!', series: newSeries });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo series' });
  }
};

const updateSeriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingSeries = await Series.findOne({ name });
    if (existingSeries) {
      return res.status(400).json({ message: 'Series này đã tồn tại!' });
    }

    const updatedSeries = await Series.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedSeries) {
      return res.status(404).json({ message: 'Không tìm thấy series để sửa' });
    }

    res.json({ message: 'Cập nhật thành công', series: updatedSeries });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật series' });
  }
};

const deleteSeriesById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSeries = await Series.findByIdAndDelete(id);

    if (!deletedSeries) {
      return res.status(404).json({ message: 'Không tìm thấy series để xóa' });
    }

    res.json({ message: 'Xóa series thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa series' });
  }
};

module.exports = { 
  getAllSeries, 
  getSeriesById, 
  createSeries, 
  updateSeriesById, 
  deleteSeriesById 
}; 

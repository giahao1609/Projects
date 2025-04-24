// config/database.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load biến môi trường

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Sử dụng từ .env
    console.log('✅ Đã kết nối MongoDB (local)');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    throw err;
  }
};

module.exports = connectDB;

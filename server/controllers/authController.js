const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Đăng ký người dùng mới
const registerUser = async (req, res) => {
  const { username, email, password, birthDate, phoneNumber } = req.body;

  try {
    // Kiểm tra người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới và lưu vào DB
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      birthDate,
      phoneNumber
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (err) {
    console.error('Lỗi đăng ký:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '6h' }
    );

    res.json({ message: "Đăng nhập thành công", token,  username: user.username 
    });
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const logoutUser = (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};

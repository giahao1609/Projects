import React, { useState } from 'react';
import axios from 'axios';
import '../styles/auth.css';

interface RegisterFormProps {
  showLogin: () => void;  // Hàm chuyển sang form đăng nhập
}

const RegisterForm: React.FC<RegisterFormProps> = ({ showLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    birthDate: '',
    phoneNumber: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(res.data.message); // Hiển thị thông báo thành công
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi không xác định');
    }
  };

  return (
    <div className="form-container">
      <h2>Đăng ký</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Tên người dùng */}
        <div>
          <label htmlFor="username">Tên người dùng</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Nhập tên người dùng"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Ngày sinh */}
        <div>
          <label htmlFor="birthDate">Ngày sinh</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label htmlFor="phoneNumber">Số điện thoại</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Nút submit */}
        <div>
          <button type="submit" className="submit-btn">
            Đăng ký
          </button>
        </div>
      </form>

      {/* Nút chuyển sang form đăng nhập */}
      <div className="switch-form-btn">
        <button type="button" onClick={showLogin}>
          Đã có tài khoản? Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;

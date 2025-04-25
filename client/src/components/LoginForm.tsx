import React, { useState } from 'react';
import '../styles/auth.css';

interface LoginFormProps {
  showRegister: () => void;
  onLoginSuccess: (username: string, token: string, role: string) => void; // ✅ thêm token vào props
}

const LoginForm: React.FC<LoginFormProps> = ({ showRegister, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('🔑 Response từ server:', result); // Log toàn bộ response

      if (response.ok) {
        const username = result.username || formData.email;
        const role = result.role || 'user'; // Đảm bảo luôn có role
        console.log('✅ Đăng nhập thành công với role:', role); // Log role
        onLoginSuccess(username, result.token, role);
      } else {
        alert(`⚠️ ${result.message}`);
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Đăng nhập</h2>

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="password">Mật khẩu</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Mật khẩu"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Đăng nhập</button>

      <button
        type="button"
        className="btn-switch"
        onClick={showRegister}
      >
        Chưa có tài khoản? Đăng ký
      </button>
    </form>
  );
};

export default LoginForm;

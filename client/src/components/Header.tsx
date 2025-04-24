import React, { useState, useEffect } from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import '../styles/model.css';
import '../styles/header.css';
import api from '../axiosConfig';
import { useCartStore } from '../store/cartStore';

// ✅ Định nghĩa type cho Brand, Scale, Series
type Brand = {
  _id: string;
  name: string;
};

type Scale = {
  _id: string;
  name: string;
};

type Series = {
  _id: string;
  name: string;
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Thêm kiểu dữ liệu vào state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [scales, setScales] = useState<Scale[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  const cartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCount);

  // ✅ Fetch dữ liệu thương hiệu, scale và series
  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandResponse = await api.get('/brands');
        setBrands(brandResponse.data);

        const scaleResponse = await api.get('/scales');
        setScales(scaleResponse.data);

        const seriesResponse = await api.get('/series');
        setSeries(seriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await api.get('/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data.items || [];
      const totalCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error('❌ Lỗi lấy giỏ hàng:', err);
      setCartCount(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      fetchCartCount();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (username: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUsername(username);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    fetchCartCount();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setCartCount(0);
    navigate('/');
  };

  return (
    <header>
      <div className={`sub-header ${isScrolled ? 'hidden' : ''} text-right bg-gray-100 px-4 py-1 text-sm`}>
        <span>Liên hệ: 0123 456 789 &nbsp;|&nbsp; Giờ mở cửa: 08:00 - 21:00</span>
      </div>

      <div className="header-inner sticky z-50 flex items-center justify-between px-4 py-3 shadow-md bg-white" style={{ top: isScrolled ? '0' : '30px' }}>
        <div className="logo flex items-center gap-2">
          <img src="/assets/logo.jpg" alt="Logo" className="w-10 h-10 object-contain" />
          <Link to="/" className="font-bold text-xl">Gundam Shop</Link>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/">Trang chủ</Link>
          <Link to="/products/new">Sản phẩm</Link>

          {/* Brand Dropdown */}
          <div className="relative group">
            <Link to="/brands">Nhãn hiệu</Link>
            <div className="group-hover:block absolute top-full left-0 bg-white border shadow-md p-2 hidden z-10">
              {brands.map((brand) => (
                <Link key={brand._id} to={`/products/brands/${encodeURIComponent(brand.name)}`} className="block px-4 py-2 text-sm hover:bg-gray-100">
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Scale Dropdown */}
          <div className="relative group">
            <Link to="/scales" className="hover:underline">Scale Mô Hình</Link>
            <div className="absolute left-0 top-full z-10 hidden bg-white p-2 shadow-md border group-hover:block">
              {scales.map((scale) => (
                <Link key={scale._id} to={`/products/scale/${scale._id}`} className="block px-4 py-2 text-sm hover:bg-gray-100">
                  {scale.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Series Dropdown */}
          <div className="relative group">
            <Link to="/series" className="hover:underline">Series</Link>
            <div className="absolute left-0 top-full z-10 hidden bg-white p-2 shadow-md border group-hover:block">
              {series.map((serie) => (
                <Link key={serie._id} to={`/products/series/${serie._id}`} className="block px-4 py-2 text-sm hover:bg-gray-100">
                  {serie.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="search-cart flex items-center gap-4 relative">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." className="border px-2 py-1 rounded-md text-sm" />

          <Link to="/cart" className="relative flex items-center gap-1">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span>Xin chào, {username}</span>
              <Link to="/orders" className="text-sm text-blue-600 hover:underline">Xem đơn hàng</Link>
              <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline">Đăng xuất</button>
            </div>
          ) : (
            <button onClick={() => setShowAuthModal(true)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition">
              <User className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showAuthModal && (
        <div className="modal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isLoginForm ? 'Đăng nhập' : 'Đăng ký'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowAuthModal(false)} aria-label="Close">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {isLoginForm ? (
                  <LoginForm showRegister={() => setIsLoginForm(false)} onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <RegisterForm showLogin={() => setIsLoginForm(true)} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

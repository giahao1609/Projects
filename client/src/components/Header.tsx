import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Search } from 'lucide-react';
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

interface LoginFormProps {
  showRegister: () => void;
  onLoginSuccess: (username: string, token: string, role: string) => void;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  // ✅ Thêm kiểu dữ liệu vào state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [scales, setScales] = useState<Scale[]>([]);
  const [series, setSeries] = useState<Series[]>([]);

  const cartCount = useCartStore((state) => state.count);
  const setCartCount = useCartStore((state) => state.setCount);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

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
    const storedRole = localStorage.getItem('role');

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedRole || '');
      fetchCartCount();
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginSuccess = (username: string, token: string, role: string) => {
    console.log('🎯 handleLoginSuccess được gọi với:', { username, role }); // Log thông tin

    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    
    setUsername(username);
    setUserRole(role);
    setIsLoggedIn(true);
    setShowAuthModal(false);
    fetchCartCount();

    console.log('👉 Kiểm tra role trước khi chuyển trang:', role); // Log kiểm tra
    
    if (role === 'admin') {
      console.log('🚀 Đang chuyển hướng đến /admin'); // Log trước khi chuyển trang
      navigate('/admin');
      console.log('✨ Đã gọi navigate'); // Log sau khi gọi navigate
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    setCartCount(0);
    navigate('/');
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log('Đang tìm kiếm:', value); // Debug log

    if (value.trim()) {
      try {
        const response = await api.get(`/products/search?name=${encodeURIComponent(value)}`);
        console.log('Kết quả tìm kiếm:', response.data); // Debug log
        setSearchResults(response.data);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Lỗi tìm kiếm:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Xử lý khi click vào sản phẩm trong kết quả tìm kiếm
  const handleSelectProduct = (productName: string) => {
    console.log('Chọn sản phẩm:', productName); // Debug log
    setShowSearchResults(false);
    setSearchTerm('');
    navigate(`/products/${encodeURIComponent(productName)}`);
  };

  // Xử lý khi nhấn Enter trong ô tìm kiếm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit tìm kiếm:', searchTerm); // Debug log
    if (searchTerm.trim()) {
      setShowSearchResults(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Đóng kết quả tìm kiếm khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchContainer = document.getElementById('search-container');
      if (searchContainer && !searchContainer.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`sub-header ${isScrolled ? 'hidden' : ''} text-right bg-gray-100 px-4 py-1 text-sm`}>
        <span>Liên hệ: 0123 456 789 &nbsp;|&nbsp; Giờ mở cửa: 08:00 - 21:00</span>
      </div>

      <div className="header-inner" style={{ top: isScrolled ? '0' : '30px' }}>
        <div className="logo">
          <img src="/assets/logo.jpg" alt="Logo" />
          <Link to="/">Gundam Shop</Link>
        </div>

        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>

          {/* Hiển thị menu quản lý chỉ khi user là admin */}
          {userRole === 'admin' && (
            <div className="relative group">
              <span className="hover:underline cursor-pointer">Quản lý</span>
              <div className="absolute left-0 top-full z-10 hidden bg-white p-2 shadow-md border group-hover:block min-w-[200px]">
                <Link 
                  to="/admin/products"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý sản phẩm
                </Link>
                <Link 
                  to="/admin/users"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý người dùng
                </Link>
                <Link 
                  to="/admin/orders"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý đơn hàng
                </Link>
                <Link 
                  to="/admin/brands"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý thương hiệu
                </Link>
                <Link 
                  to="/admin/scales"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý tỷ lệ
                </Link>
                <Link 
                  to="/admin/series"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Quản lý series
                </Link>
              </div>
            </div>
          )}

          {/* Brand Dropdown */}
          <div className="relative group">
            <Link to="/brands">Nhãn hiệu</Link>
            <div className="group-hover:block absolute top-full left-0 bg-white border shadow-md p-2 hidden z-10">
              {brands.map((brand) => (
                <Link 
                  key={brand._id} 
                  to={`/products/brands/${encodeURIComponent(brand.name)}`} 
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
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
                <Link 
                  key={scale._id} 
                  to={`/products/scale/${encodeURIComponent(scale.name)}`} 
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
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
                <Link 
                  key={serie._id} 
                  to={`/products/series/${serie.name}`} 
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {serie.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="search-cart">
          <div className="relative w-64"> {/* Đặt width cụ thể */}
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Kết quả tìm kiếm */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product._id}
                    className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100"
                    onClick={() => handleSelectProduct(product.name)}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-sm text-red-600">
                        {product.discountPrice?.toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <ShoppingCart />
            {cartCount > 0 && (
              <span>{cartCount}</span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span>Xin chào, {username}</span>
              <Link to="/orders" className="text-sm text-blue-600 hover:underline">
                Xem đơn hàng
              </Link>
              <button onClick={handleLogout} className="text-sm text-blue-600 hover:underline">
                Đăng xuất
              </button>
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

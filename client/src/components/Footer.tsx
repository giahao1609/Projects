// /src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <p>Gundam Shop - Chuyên cung cấp các mô hình Gundam chính hãng với chất lượng tốt nhất và giá cả hợp lý nhất.</p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/assets/Facebook.jpg" alt="Facebook" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <img src="/assets/Youtube.jpg" alt="YouTube" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
              <img src="/assets/Tiktok.jpg" alt="TikTok" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Thông tin liên hệ</h3>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              123 Đường ABC, Quận XYZ, TP.HCM
            </li>
            <li>
              <i className="fas fa-phone"></i>
              Hotline: 0123.456.789
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              Email: contact@gundamshop.com
            </li>
            <li>
              <i className="fas fa-clock"></i>
              Giờ làm việc: 8:00 - 22:00
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Chính sách</h3>
          <ul>
            <li>
              <Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
            </li>
            <li>
              <Link to="/chinh-sach-bao-hanh">Chính sách bảo hành</Link>
            </li>
            <li>
              <Link to="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link>
            </li>
            <li>
              <Link to="/huong-dan-mua-hang">Hướng dẫn mua hàng</Link>
            </li>
            <li>
              <Link to="/phuong-thuc-thanh-toan">Phương thức thanh toán</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Đăng ký nhận tin</h3>
          <p>Đăng ký để nhận thông tin về sản phẩm mới và khuyến mãi</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Nhập email của bạn" />
            <button type="submit">Đăng ký</button>
          </form>
          <div className="payment-methods">
            <h4>Phương thức thanh toán</h4>
            <div className="payment-icons">
              <img src="/assets/Bank.jpg" alt="Thanh toán ngân hàng" />
              <img src="/assets/Momo.jpg" alt="Thanh toán MoMo" />
              <img src="/assets/Pay.jpg" alt="Các phương thức thanh toán khác" />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 Gundam Shop. Tất cả quyền được bảo lưu.</p>
          <div className="footer-bottom-links">
            <Link to="/dieu-khoan">Điều khoản sử dụng</Link>
            <Link to="/bao-mat">Chính sách bảo mật</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

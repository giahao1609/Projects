import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import api from '../axiosConfig';
import '../styles/ProductCard.css';

interface ProductProps {
  product: {
    _id: string;
    name: string;
    description: string;
    oldPrice: number;
    discountPrice: number;
    category: string;
    stock: number;
    image: string;
    series: string;
    brand: string;
    scale: string;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const increment = useCartStore((state) => state.increment);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('🔒 Vui lòng đăng nhập để thêm vào giỏ hàng');
        return;
      }

      const response = await api.post(
        '/cart',
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      increment();
      alert('✅ Đã thêm vào giỏ hàng');
      console.log('🛒 Kết quả:', response.data);
    } catch (err) {
      console.error('❌ Lỗi khi thêm giỏ hàng:', err);
      alert('❌ Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${encodeURIComponent(product.name)}`} className="product-link">
        <img
          alt={product.name}
          src={`/assets/${product.name}/${product.image}`}
          className="product-image"
        />
        <h3 className="product-name">{product.name}</h3>
      </Link>

      <div className="product-meta">
        <p className="product-meta-item">
          <strong>Thương hiệu:</strong> {product.brand || 'Không có thương hiệu'}
        </p>
        <p className="product-meta-item">
          <strong>Scale mô hình:</strong> {product.scale || 'Không có thông tin'}
        </p>
        <p className="product-meta-item">
          <strong>Dòng sản phẩm:</strong> {product.series || 'Không có dòng sản phẩm'}
        </p>
      </div>

      <div className="product-price">
        {product.oldPrice && product.oldPrice > product.discountPrice && (
          <p className="old-price">
            {product.oldPrice.toLocaleString()} đ
          </p>
        )}
        <p className="discount-price">
          {product.discountPrice.toLocaleString()} đ
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        className="add-to-cart-btn"
      >
        ➕ Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;

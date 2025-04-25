import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import api from '../axiosConfig';
import '../styles/ProductDetail.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  detailDescription: string;
  oldPrice: number;
  discountPrice: number;
  category: string;
  brand: string;
  series: string;
  ratio: string;
  scale: string;
  stock: number;
  image: string;
  gallery?: string[];
}

const ProductDetailPage: React.FC = () => {
  const { productName } = useParams<{ productName: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const increment = useCartStore((state) => state.increment);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/name/${encodeURIComponent(productName!)}`);
        setProduct(response.data);
        setSelectedImage(response.data.image);
      } catch (err) {
        console.error('Lỗi khi tải thông tin sản phẩm:', err);
        setError('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchProduct();
    }
  }, [productName]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('🔒 Vui lòng đăng nhập để thêm vào giỏ hàng');
        return;
      }

      await api.post(
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
    } catch (err) {
      console.error('❌ Lỗi khi thêm giỏ hàng:', err);
      alert('❌ Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (error || !product) {
    return <div className="error-message">{error || 'Không tìm thấy sản phẩm'}</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img src={`/assets/${product.name}/${selectedImage}`} alt={product.name} />
          </div>
          {product.gallery && product.gallery.length > 0 && (
            <div className="image-gallery">
              {[product.image, ...product.gallery].map((img, index) => (
                <div
                  key={index}
                  className={`gallery-thumbnail ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={`/assets/${product.name}/${img}`} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <p className="product-meta-item">
              <span className="meta-label">Thương hiệu:</span>
              <span className="meta-value">{product.brand}</span>
            </p>
            <p className="product-meta-item">
              <span className="meta-label">Scale:</span>
              <span className="meta-value">{product.scale}</span>
            </p>
            <p className="product-meta-item">
              <span className="meta-label">Series:</span>
              <span className="meta-value">{product.series}</span>
            </p>
          </div>

          <div className="product-price">
            {product.oldPrice > product.discountPrice && (
              <span className="old-price">{product.oldPrice.toLocaleString()}đ</span>
            )}
            <span className="current-price">{product.discountPrice.toLocaleString()}đ</span>
          </div>

          <div className="product-description">
            <h2>Mô tả sản phẩm</h2>
            <p>{product.description}</p>
          </div>

          <div 
            className="product-detail-description"
            dangerouslySetInnerHTML={{ __html: product.detailDescription }}
          />

          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? '➕ Thêm vào giỏ hàng' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 
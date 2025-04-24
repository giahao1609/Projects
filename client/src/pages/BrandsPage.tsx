import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Thêm useParams để lấy giá trị từ URL
import ProductCard from '../components/ProductCard';  // Import ProductCard
import api from '../axiosConfig';  // Import axios từ file axiosConfig.ts

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;  // Có thể không có nếu không có giá cũ
  discountPrice: number;  // Có thể không có nếu không có giá giảm
  category: string;
  stock: number;
  image: string; // required luôn
  series: string; // Dòng sản phẩm, ví dụ: "Product01"
  brand: string;  // Thêm thuộc tính brand
  scale: string;  // Thêm thuộc tính scale
}

const BrandPage: React.FC = () => {
  const { brandName } = useParams<{ brandName: string }>();  // Lấy brandName từ URL
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brandName) {
      api.get(`/products/brands/${encodeURIComponent(brandName)}`)  // Sử dụng URL với brandName
        .then(res => {
          setProducts(res.data);  // Dữ liệu sẽ có trong res.data
        })
        .catch(err => {
          console.error('Lỗi khi tải sản phẩm:', err);
          setError(err.message);  // Lưu thông báo lỗi
        })
        .finally(() => {
          setLoading(false);  // Khi hoàn thành tải dữ liệu (hoặc có lỗi), tắt trạng thái loading
        });
    }
  }, [brandName]);  // Thêm brandName vào dependency list để gọi lại khi thay đổi

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        Đang tải sản phẩm...
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Đã xảy ra lỗi: {error}</div>;
  }

  return (
    <div className="product-list-wrapper">
      {/* Thêm ImageSlider trước danh sách sản phẩm */}

      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>Không có sản phẩm nào để hiển thị</div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';  // Đảm bảo bạn import ProductCard đúng cách
import ImageSlider from './ImageSlider'; // Import ImageSlider
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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);  // Thêm loading để hiển thị trạng thái tải
  const [error, setError] = useState<string | null>(null);  // Thêm error để xử lý lỗi

  useEffect(() => {
    api.get('/products/products')  // Sử dụng api đã được cấu hình trong axiosConfig.ts
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
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div> {/* Hiển thị spinner hoặc hiệu ứng khi đang tải */}
        Đang tải sản phẩm...
      </div>
    );  // Hiển thị trạng thái khi đang tải
  }

  if (error) {
    return <div className="error-message">Đã xảy ra lỗi: {error}</div>;  // Hiển thị thông báo lỗi nếu có
  }

  return (
    <div className="product-list-wrapper">
      {/* Thêm ImageSlider trước danh sách sản phẩm */}
      <ImageSlider />

      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>Không có sản phẩm nào để hiển thị</div>  // Thông báo nếu danh sách sản phẩm rỗng
        )}
      </div>
    </div>
  );
};

export default ProductList;

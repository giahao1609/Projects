import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../axiosConfig';

interface Product {
  _id: string;
  name: string;
  description: string;
  oldPrice: number;
  discountPrice: number;
  category: string;
  brand: string;
  series: string;
  ratio: string;
  scale: string;
  stock: number;
  image: string; // chắc chắn có
  gallery?: string[]; // Cập nhật đúng theo schema
}

const BrandPage: React.FC = () => {
  const { brandName } = useParams<{ brandName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (brandName) {
      api.get(`/products/brands/${encodeURIComponent(brandName)}`)
        .then(res => {
          setProducts(res.data);
        })
        .catch(err => {
          console.error('Lỗi khi tải sản phẩm:', err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [brandName]);

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
    <div className="brands-page">
      <div className="brands-header">
        <h1 className="brand-title">{brandName}</h1>
        <p className="brand-description">Khám phá các sản phẩm từ thương hiệu {brandName}</p>
      </div>

      <div className="product-list-wrapper">
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => {
              const mainImage = product.image || product.gallery?.[0] || '/assets/default-image.jpg';

              return (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    image: mainImage, // Gán ảnh chính cho ProductCard
                  }}
                />
              );
            })
          ) : (
            <div className="no-products">Không có sản phẩm nào để hiển thị</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;

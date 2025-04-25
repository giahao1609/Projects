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
  image: string;
  gallery?: string[];
}

const ScalePage: React.FC = () => {
  const { scaleName } = useParams<{ scaleName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scaleName) {
      api.get(`/products/scales/${encodeURIComponent(scaleName)}`)
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
  }, [scaleName]);

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
    <div className="scales-page">
      <div className="scales-header">
        <h1 className="scale-title">{scaleName}</h1>
        <p className="scale-description">Khám phá các sản phẩm mô hình tỉ lệ {scaleName}</p>
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
                    image: mainImage,
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

export default ScalePage;

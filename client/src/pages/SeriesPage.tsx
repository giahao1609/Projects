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

const SeriesPage: React.FC = () => {
  const { seriesName } = useParams<{ seriesName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (seriesName) {
      api.get(`/products/series/${encodeURIComponent(seriesName)}`)
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
  }, [seriesName]);

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
    <div className="series-page">
      <div className="series-header">
        <h1 className="series-title">{seriesName}</h1>
        <p className="series-description">Khám phá các sản phẩm thuộc dòng {seriesName}</p>
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

export default SeriesPage;

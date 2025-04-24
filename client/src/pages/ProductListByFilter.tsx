import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import axios nếu chưa có
import ProductCard from '../components/ProductCard'; // Component hiển thị sản phẩm

const ProductListByFilter: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { brandId, scaleId, seriesId } = useParams<{ brandId?: string; scaleId?: string; seriesId?: string }>();

  // Các hàm gọi API theo từng filter
  const getProductsByBrand = async (brandId: string) => {
    const response = await axios.get(`/api/products/brand/${brandId}`);
    return response.data;
  };

  const getProductsByScale = async (scaleId: string) => {
    const response = await axios.get(`/api/products/scale/${scaleId}`);
    return response.data;
  };

  const getProductsBySeries = async (seriesId: string) => {
    const response = await axios.get(`/api/products/series/${seriesId}`);
    return response.data;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        let response;
        if (brandId) {
          response = await getProductsByBrand(brandId);
        } else if (scaleId) {
          response = await getProductsByScale(scaleId);
        } else if (seriesId) {
          response = await getProductsBySeries(seriesId);
        } else {
          const res = await axios.get('/api/products');
          response = res.data;
        }
        setProducts(response);
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi lấy sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [brandId, scaleId, seriesId]);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Sản phẩm</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>Không có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListByFilter;

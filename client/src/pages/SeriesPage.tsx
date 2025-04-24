import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../axiosConfig';

const SeriesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/products/series/${id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi khi lấy sản phẩm theo series:', err));
  }, [id]);

  return (
    <div className="product-list-wrapper">
      <h2 className="text-xl font-bold mb-4">Sản phẩm theo Dòng sản phẩm</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>Không có sản phẩm nào trong dòng sản phẩm này</div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../axiosConfig';

const ScalesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/products/scale/${id}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Lỗi khi lấy sản phẩm theo scale:', err));
  }, [id]);

  return (
    <div className="product-list-wrapper">
      <h2 className="text-xl font-bold mb-4">Sản phẩm theo Scale</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div>Không có sản phẩm nào với scale này</div>
        )}
      </div>
    </div>
  );
};

export default ScalesPage;
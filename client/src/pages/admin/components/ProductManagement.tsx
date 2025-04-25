import React, { useState, useEffect } from 'react';
import api from '../../../axiosConfig';

interface Product {
  _id: string;
  name: string;
  description: string;
  oldPrice: number;
  discountPrice: number;
  category: string;
  stock: number;
  brand: string;
  series: string;
  scale: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/admin-product/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="management-container">
      <h2>Quản lý sản phẩm</h2>
      <button className="add-button">Thêm sản phẩm mới</button>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá gốc</th>
              <th>Giá khuyến mãi</th>
              <th>Thương hiệu</th>
              <th>Series</th>
              <th>Tỷ lệ</th>
              <th>Tồn kho</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.oldPrice.toLocaleString()}đ</td>
                <td>{product.discountPrice.toLocaleString()}đ</td>
                <td>{product.brand}</td>
                <td>{product.series}</td>
                <td>{product.scale}</td>
                <td>{product.stock}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsEditing(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement; 
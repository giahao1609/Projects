import React, { useState, useEffect } from 'react';
import api from '../../../axiosConfig';

interface Brand {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBrand, setNewBrand] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await api.get('/admin/brands');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/brands', newBrand);
      setNewBrand({ name: '', description: '' });
      setIsAdding(false);
      fetchBrands();
    } catch (error) {
      console.error('Error adding brand:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
      try {
        await api.delete(`/admin/brands/${id}`);
        fetchBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="management-container">
      <h2>Quản lý thương hiệu</h2>
      
      <button 
        className="add-button"
        onClick={() => setIsAdding(true)}
      >
        Thêm thương hiệu mới
      </button>

      {isAdding && (
        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            placeholder="Tên thương hiệu"
            value={newBrand.name}
            onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Mô tả"
            value={newBrand.description}
            onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
          />
          <button type="submit">Thêm</button>
          <button type="button" onClick={() => setIsAdding(false)}>Hủy</button>
        </form>
      )}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên thương hiệu</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand._id}>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>{new Date(brand.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => {/* Hiển thị form sửa */}}
                  >
                    Sửa
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(brand._id)}
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

export default BrandManagement; 
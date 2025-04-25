import React, { useState, useEffect } from 'react';
import api from '../../../axiosConfig';

interface Scale {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const ScaleManagement: React.FC = () => {
  const [scales, setScales] = useState<Scale[]>([]);
  const [loading, setLoading] = useState(true);
  const [newScale, setNewScale] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingScale, setEditingScale] = useState<Scale | null>(null);

  useEffect(() => {
    fetchScales();
  }, []);

  const fetchScales = async () => {
    try {
      const response = await api.get('/admin/scales');
      setScales(response.data);
    } catch (error) {
      console.error('Error fetching scales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingScale) {
        await api.put(`/admin/scales/${editingScale._id}`, newScale);
        setEditingScale(null);
      } else {
        await api.post('/admin/scales', newScale);
      }
      setNewScale({ name: '', description: '' });
      setIsAdding(false);
      fetchScales();
    } catch (error) {
      console.error('Error saving scale:', error);
    }
  };

  const handleEdit = (scale: Scale) => {
    setEditingScale(scale);
    setNewScale({ name: scale.name, description: scale.description || '' });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa tỷ lệ này?')) {
      try {
        await api.delete(`/admin/scales/${id}`);
        fetchScales();
      } catch (error) {
        console.error('Error deleting scale:', error);
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="management-container">
      <h2>Quản lý tỷ lệ mô hình</h2>
      
      <button 
        className="add-button"
        onClick={() => {
          setIsAdding(true);
          setEditingScale(null);
          setNewScale({ name: '', description: '' });
        }}
      >
        Thêm tỷ lệ mới
      </button>

      {isAdding && (
        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            placeholder="Tên tỷ lệ (VD: 1/144, 1/100)"
            value={newScale.name}
            onChange={(e) => setNewScale({...newScale, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Mô tả"
            value={newScale.description}
            onChange={(e) => setNewScale({...newScale, description: e.target.value})}
          />
          <button type="submit">
            {editingScale ? 'Cập nhật' : 'Thêm'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setIsAdding(false);
              setEditingScale(null);
            }}
          >
            Hủy
          </button>
        </form>
      )}
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tên tỷ lệ</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {scales.map((scale) => (
              <tr key={scale._id}>
                <td>{scale.name}</td>
                <td>{scale.description}</td>
                <td>{new Date(scale.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(scale)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(scale._id)}
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

export default ScaleManagement; 
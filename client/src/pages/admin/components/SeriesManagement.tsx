import React, { useState, useEffect } from 'react';
import api from '../../../axiosConfig';

interface Series {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const SeriesManagement: React.FC = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSeries, setNewSeries] = useState({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await api.get('/admin/series');
      setSeries(response.data);
    } catch (error) {
      console.error('Error fetching series:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSeries) {
        await api.put(`/admin/series/${editingSeries._id}`, newSeries);
        setEditingSeries(null);
      } else {
        await api.post('/admin/series', newSeries);
      }
      setNewSeries({ name: '', description: '' });
      setIsAdding(false);
      fetchSeries();
    } catch (error) {
      console.error('Error saving series:', error);
    }
  };

  const handleEdit = (series: Series) => {
    setEditingSeries(series);
    setNewSeries({ name: series.name, description: series.description || '' });
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa series này?')) {
      try {
        await api.delete(`/admin/series/${id}`);
        fetchSeries();
      } catch (error) {
        console.error('Error deleting series:', error);
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="management-container">
      <h2>Quản lý Series</h2>
      
      <button 
        className="add-button"
        onClick={() => {
          setIsAdding(true);
          setEditingSeries(null);
          setNewSeries({ name: '', description: '' });
        }}
      >
        Thêm series mới
      </button>

      {isAdding && (
        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            placeholder="Tên series (VD: Gundam SEED, Gundam Wing)"
            value={newSeries.name}
            onChange={(e) => setNewSeries({...newSeries, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Mô tả"
            value={newSeries.description}
            onChange={(e) => setNewSeries({...newSeries, description: e.target.value})}
          />
          <button type="submit">
            {editingSeries ? 'Cập nhật' : 'Thêm'}
          </button>
          <button 
            type="button" 
            onClick={() => {
              setIsAdding(false);
              setEditingSeries(null);
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
              <th>Tên series</th>
              <th>Mô tả</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="edit-button"
                    onClick={() => handleEdit(s)}
                  >
                    Sửa
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(s._id)}
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

export default SeriesManagement; 
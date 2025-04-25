import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import OrderManagement from './components/OrderManagement';
import BrandManagement from './components/BrandManagement';
import ScaleManagement from './components/ScaleManagement';
import SeriesManagement from './components/SeriesManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const userRole = localStorage.getItem('role');
  
  console.log('🔒 AdminDashboard - Role hiện tại:', userRole); // Log role trong dashboard

  // Kiểm tra role admin
  if (userRole !== 'admin') {
    console.log('⚠️ Không có quyền admin, chuyển hướng về trang chủ'); // Log khi không có quyền
    return <Navigate to="/" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'brands':
        return <BrandManagement />;
      case 'scales':
        return <ScaleManagement />;
      case 'series':
        return <SeriesManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <button
            className={`nav-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="fas fa-box"></i>
            Quản lý sản phẩm
          </button>
          <button
            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i>
            Quản lý người dùng
          </button>
          <button
            className={`nav-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-shopping-cart"></i>
            Quản lý đơn hàng
          </button>
          <button
            className={`nav-button ${activeTab === 'brands' ? 'active' : ''}`}
            onClick={() => setActiveTab('brands')}
          >
            <i className="fas fa-trademark"></i>
            Quản lý thương hiệu
          </button>
          <button
            className={`nav-button ${activeTab === 'scales' ? 'active' : ''}`}
            onClick={() => setActiveTab('scales')}
          >
            <i className="fas fa-ruler"></i>
            Quản lý tỷ lệ
          </button>
          <button
            className={`nav-button ${activeTab === 'series' ? 'active' : ''}`}
            onClick={() => setActiveTab('series')}
          >
            <i className="fas fa-layer-group"></i>
            Quản lý series
          </button>
        </nav>
      </div>
      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
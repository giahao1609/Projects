import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/product.css';
import Header from './components/Header';
import Footer from './components/Footer';

import HomePage from './pages/Home'; // Sử dụng HomePage thay vì Home nếu đây là trang chính
import CartPage from './pages/cart';
import CheckoutPage from './pages/CheckoutPage';
import OrderDetailPage from './pages/OrderDetailPage';
import UserOrdersPage from './pages/UserOrdersPage';
import BrandsPage from './pages/BrandsPage';
import ScalesPage from './pages/ScalesPage';
import SeriesPage from './pages/SeriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AllProducts from './pages/AllProducts';
import AdminDashboard from './pages/admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen app-wrapper">
      <Header />

      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Đảm bảo đây là trang chính của bạn */}
          
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/orders" element={<UserOrdersPage />} />

          {/* ✅ Thêm các route cho brand, scale, series và sản phẩm */}
          <Route path="/products/brands/:brandName" element={<BrandsPage />} />
          <Route path="/products/scale/:scaleName" element={<ScalesPage />} />
          <Route path="/products/series/:seriesName" element={<SeriesPage />} />
          <Route path="/products/:productName" element={<ProductDetailPage />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/order-detail.css';

interface CartItem {
  product: {
    name: string;
    discountPrice: number;
    image: string; // 👈 THÊM dòng này

  };
  quantity: number;
}

interface Order {
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
  totalAmount: number;
  paymentMethod: string;
  status: string;
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data);
      } catch (error) {
        console.error('❌ Lỗi tải chi tiết đơn hàng:', error);
        alert('❌ Không thể tải đơn hàng này');
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Đã hủy đơn hàng');
      setOrder(prev => prev ? { ...prev, status: 'Đã hủy' } : prev);
    } catch (error) {
      console.error('❌ Lỗi khi hủy đơn hàng:', error);
      alert('❌ Không thể hủy đơn hàng');
    }
  };

  if (!order) return <div>Đang tải...</div>;

  return (
    <div className="order-detail-container">
      <h2>Chi tiết đơn hàng</h2>

      <button className="back-home-button" onClick={() => navigate('/')}>🏠 Quay về trang chủ</button>

      <div className="order-info">
        <h3>Thông tin giao hàng</h3>
        <p><strong>Họ và tên:</strong> {order.shippingAddress.fullName}</p>
        <p><strong>Số điện thoại:</strong> {order.shippingAddress.phone}</p>
        <p><strong>Địa chỉ:</strong> {order.shippingAddress.address}</p>
      </div>

      <div className="order-items">
        <h3>Sản phẩm trong đơn hàng</h3>
        <ul>
            {order.items.map((item, index) => (
            <li key={index} className="order-item">
            <img 
            src={`/assets/${item.product.name}/${item.product.image}`} 
            alt={item.product.name} 
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
            />
      <div>
        <p><strong>{item.product.name}</strong></p>
        <p>Số lượng: {item.quantity}</p>
        <p>Giá: {item.product.discountPrice.toLocaleString()}đ</p>
      </div>
    </li>
  ))}
</ul>

      </div>

      <div className="order-summary">
        <h3>Tổng cộng: {order.totalAmount.toLocaleString()}đ</h3>
        <p><strong>Phương thức thanh toán:</strong> {order.paymentMethod}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
      </div>

      {order.status !== 'Đã hủy' && (
        <button className="cancel-button" onClick={handleCancelOrder}>❌ Hủy đơn hàng</button>
      )}
    </div>
  );
};

export default OrderDetailPage;

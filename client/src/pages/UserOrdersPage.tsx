import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/user-orders.css';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
  };
}

const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách đơn hàng:', error);
        alert('Không thể tải đơn hàng');
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Đã hủy đơn hàng');
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'Đã hủy' } : order
        )
      );
    } catch (error) {
      console.error('❌ Lỗi khi hủy đơn hàng:', error);
      alert('❌ Không thể hủy đơn hàng');
    }
  };

  return (
    <div className="user-orders-container">
      <h2>Đơn hàng của tôi</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id} onClick={() => navigate(`/orders/${order._id}`)}>
            <div className="user-orders-info">
              <p><strong>ID:</strong> {order._id}</p>
              <p><strong>Ngày đặt:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Tổng cộng:</strong> {order.totalAmount.toLocaleString()}đ</p>
              <p>
                <strong>Trạng thái:</strong>{' '}
                <span className={`status ${
                  order.status === 'Đang xử lý' ? 'processing' :
                  order.status === 'Đã giao' ? 'completed' :
                  order.status === 'Đã hủy' ? 'cancelled' : ''
                }`}>{order.status}</span>
              </p>
              <p><strong>Thanh toán:</strong> {order.paymentMethod}</p>
              <p><strong>Giao đến:</strong> {order.shippingAddress.fullName} - {order.shippingAddress.phone}</p>
              <p><strong>Địa chỉ:</strong> {order.shippingAddress.address}</p>
            </div>
            {order.status !== 'Đã hủy' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelOrder(order._id);
                }}
              >
                ❌ Hủy đơn
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrdersPage;
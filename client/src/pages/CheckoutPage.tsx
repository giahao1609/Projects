import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout.css';

interface CartItem {
  productId: {
    _id: string;
    name: string;
    discountPrice: number;
  };
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.items);
      const calculatedTotal = res.data.items.reduce(
        (acc: number, item: CartItem) =>
          acc + item.productId.discountPrice * item.quantity,
        0
      );
      setTotal(calculatedTotal);
    };
    fetchCart();
  }, []);

  const handleOrderSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderItems = cartItems.map(item => ({
        product: item.productId._id,
        name: item.productId.name,
        price: item.productId.discountPrice,
        quantity: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        shippingAddress: {
          fullName,
          phone,
          address,
        },
        totalAmount: total,
        paymentMethod,
        isPaid: false,
        status: 'Pending',
      };

      const response = await axios.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderId(response.data._id);

      alert('🟢 Đặt hàng thành công!');
    } catch (error) {
      console.error('❌ Lỗi đặt hàng:', error);
      alert('❌ Có lỗi khi đặt hàng, vui lòng thử lại.');
    }
  };

  const goToOrderDetail = () => {
    if (orderId) {
      navigate(`/orders/${orderId}`);
    }
  };

  return (
    <div className="checkout-container">
      <h2>📦 Thông tin giao hàng</h2>
      <div className="checkout-form">
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Địa chỉ nhận hàng"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <div className="payment-method">
          <label>Phương thức thanh toán:</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Thanh toán khi nhận hàng (COD)</option>
            <option value="BankTransfer">Chuyển khoản</option>
            <option value="Momo">Ví Momo</option>
          </select>
        </div>

        <div className="checkout-total">
          <strong>Tổng cộng: {total.toLocaleString()}đ</strong>
        </div>

        <button className="place-order-button" onClick={handleOrderSubmit}>✅ Đặt hàng</button>

        {orderId && (
          <button className="view-order-button" onClick={goToOrderDetail} style={{ marginTop: '20px', backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '5px' }}>
            📄 Xem chi tiết đơn hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
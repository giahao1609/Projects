import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Import axiosConfig để sử dụng api đã cấu hình
import '../styles/cart.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Product {
  _id: string;
  name: string;
  oldPrice: number;
  discountPrice: number;
  image: string;
}

interface CartItem {
  productId: Product;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Khai báo navigate

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/cart', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.items);

      const newTotal = res.data.items.reduce(
        (acc: number, item: CartItem) =>
          acc + item.productId.discountPrice * item.quantity,
        0
      );
      setTotal(newTotal);
    } catch (err) {
      console.error('❌ Lỗi lấy giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/cart',
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCart();
    } catch (err) {
      console.error('❌ Lỗi cập nhật số lượng:', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error('❌ Lỗi xoá sản phẩm:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p>⏳ Đang tải giỏ hàng...</p>;

  return (
    <div className="cart-page-container">
      <h2>🛒 Giỏ hàng</h2>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>🪹 Giỏ hàng trống</p>
              <button onClick={() => navigate('/')}>Quay lại trang mua sắm</button> {/* Đảm bảo nút quay lại dẫn đến trang mua sắm */}
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={`/assets/${item.productId.name}/${item.productId.image}`}
                    alt={item.productId.name}
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <div className="item-info">
                  <h4>{item.productId.name}</h4>
                  <div className="price">
                    <span style={{ textDecoration: 'line-through', color: 'gray' }}>
                      {item.productId.oldPrice.toLocaleString()}đ
                    </span>{' '}
                    <strong style={{ color: '#dc2626' }}>
                      {item.productId.discountPrice.toLocaleString()}đ
                    </strong>
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={e =>
                        updateQuantity(item.productId._id, parseInt(e.target.value))
                      }
                    />
                    <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.productId._id)}>🗑️ Xoá</button>
                  </div>
                </div>
                <div className="subtotal">
                  {(item.productId.discountPrice * item.quantity).toLocaleString()}đ
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-summary">
            <h3>Cộng giỏ hàng</h3>
            <p>Tạm tính: {total.toLocaleString()}đ</p>
            <p>Phí giao hàng: 15.000đ</p>
            <p className="total">Tổng cộng: {(total + 15000).toLocaleString()}đ</p>
            <button className="checkout-btn">🧾 Tiến hành thanh toán</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

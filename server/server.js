const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const brandRoutes = require('./routes/brandRoutes.js'); 
const scaleRoutes = require('./routes/scaleRoutes.js'); 
const seriesRoutes = require('./routes/seriesRoutes.js');


dotenv.config(); 
const app = express();

const allowedOrigins = ['http://localhost:5173']; 

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS')); 
    }
  },
  credentials: true, 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api', brandRoutes);
app.use('/api', scaleRoutes);
app.use('/api', seriesRoutes);
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Lỗi khi kết nối MongoDB:', err);
    process.exit(1);
  });

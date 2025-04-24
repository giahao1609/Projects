const express = require('express');
const router = express.Router();
const { registerUser, loginUser,logoutUser } = require('../controllers/authController');

// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

router.post('/logout', logoutUser);


module.exports = router;

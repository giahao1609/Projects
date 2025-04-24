const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Không có quyền truy cập, yêu cầu quyền admin' });
    }
  };
  
  module.exports = authorizeAdmin;
  
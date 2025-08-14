const express = require('express');
const { register, login, verifyEmail ,updateauthorname, changepassword, twofactor, verifyOtp, getUserDetails} = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/update-author-name', verifyToken, updateauthorname);
router.post('/change-password', verifyToken, changepassword);
router.post('/two-factor', verifyToken, twofactor);
router.post('/verify-otp', verifyOtp);
router.post('/logout', (req, res) => {
  res.clearCookie('swt', {
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ message: 'Logged out successfully' });
});


router.get('/get-user-details', verifyToken, getUserDetails);
router.get('/verify/:token', verifyEmail);
router.get('/verify', verifyToken, (req, res) => {
  const { id, role } = req.user;
  res.status(200).json({
    message: 'Token is valid',
    user: {
      id,
      role,
    },
  });
});



module.exports = router;

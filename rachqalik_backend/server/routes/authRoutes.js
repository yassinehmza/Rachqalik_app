const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  upgradePlan,
  forgotPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/upgrade', protect, upgradePlan);

module.exports = router;

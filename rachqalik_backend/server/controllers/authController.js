const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../config/generateToken');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCredentials = ({ name, email, password }, isRegister = true) => {
  if (isRegister && (!name || name.trim().length < 2)) {
    return 'Name must be at least 2 characters long';
  }

  if (!email || !emailRegex.test(email)) {
    return 'Please provide a valid email';
  }

  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  return null;
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  plan: user.plan,
  role: user.role,
  createdAt: user.createdAt,
});

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const validationError = validateCredentials({ name, email, password }, true);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email is already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      plan: 'free',
    });

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { token, user: formatUser(user) },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const validationError = validateCredentials({ email, password }, false);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user: formatUser(user) },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: formatUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (!name && !password) {
      return res.status(400).json({ success: false, message: 'Provide name or password to update' });
    }

    const updates = {};

    if (name) {
      if (name.trim().length < 2) {
        return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
      }
      updates.name = name.trim();
    }

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const upgradePlan = async (req, res, next) => {
  try {
    if (req.user.plan === 'premium') {
      return res.status(400).json({ success: false, message: 'Already on premium plan' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { plan: 'premium' },
      { new: true },
    ).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Upgraded to premium successfully',
      data: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Provide a valid email' });
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, the password has been reset' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, upgradePlan, forgotPassword };

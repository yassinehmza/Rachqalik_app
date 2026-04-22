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

    const salt = await bcrypt.genSalt(12);
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
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
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
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };

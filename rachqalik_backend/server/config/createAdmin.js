require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    await User.deleteOne({ email: 'admin@example.com' });
    const salt = await bcrypt.genSalt(10);
    const pw = await bcrypt.hash('admin1234', salt);
    const u = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: pw,
      role: 'admin',
      plan: 'premium',
    });
    console.log('Admin created:', u._id.toString(), '| role:', u.role);
    await mongoose.connection.close();
    process.exit(0);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
};

createAdmin();

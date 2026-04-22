require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Rachqalik Smart Pillow Lite',
    price: 79.99,
    description: 'Comfort-focused smart pillow with basic sleep tracking support.',
    image: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28',
    stock: 120,
  },
  {
    name: 'Rachqalik Smart Pillow Pro',
    price: 129.99,
    description: 'Premium smart pillow with advanced sensors and temperature control.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2',
    stock: 80,
  },
  {
    name: 'Rachqalik Cloud Pillow',
    price: 59.99,
    description: 'Ultra-soft ergonomic pillow designed for deep and restorative sleep.',
    image: 'https://images.unsplash.com/photo-1631049035326-57414f9653ef',
    stock: 150,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log('Sample products inserted successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding products: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedProducts();

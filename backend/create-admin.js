const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/modules/auth/user.model');
const connectDB = require('./src/config/db');

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'superadmin@example.com' });
    
    if (adminExists) {
      console.log('SuperAdmin user already exists!');
      process.exit(1);
    }

    // Create admin user
    const admin = await User.create({
      name: 'SuperAdmin User',
      email: 'superadmin@example.com',
      password: 'admin123',
      role: 'SuperAdmin',
      isActive: true
    });

    console.log('✅ SuperAdmin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
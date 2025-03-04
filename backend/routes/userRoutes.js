// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const crypto = require('crypto');

// Helper function to hash passwords
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password)
    });
    
    const newUser = await user.save();
    
    // Return user without password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    const hashedPassword = hashPassword(req.body.password);
    if (user.password !== hashedPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Return user without password
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (for Raycast to fetch user info)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
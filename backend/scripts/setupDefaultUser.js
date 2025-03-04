// backend/scripts/setupDefaultUser.js
const mongoose = require('mongoose');
const User = require('../models/userModel');
const crypto = require('crypto');

// Hash password
const password = crypto.createHash('sha256').update('defaultPassword123').digest('hex');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  try {
    // Check if user exists
    let user = await User.findOne({ email: 'microgoals@example.com' });
    
    if (!user) {
      // Create user
      user = new User({
        name: 'MicroGoals User',
        email: 'microgoals@example.com',
        password: password
      });
      await user.save();
      console.log('Default user created:', user._id.toString());
    } else {
      console.log('Default user already exists:', user._id.toString());
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
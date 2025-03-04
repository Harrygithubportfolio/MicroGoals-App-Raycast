const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/microgoals', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  
  // Auto-create default user if it doesn't exist
  const User = require('./models/userModel');
  
  // Create a consistent user ID that we'll use in the extension
  const defaultUserId = '000000000000000000000001';
  
  // Check if default user exists
  User.findOne({ email: 'microgoals@example.com' })
    .then(user => {
      if (!user) {
        // Hash password
        const password = crypto.createHash('sha256').update('defaultPassword123').digest('hex');
        
        // Create user with predetermined ID
        const newUser = new User({
          _id: defaultUserId,
          name: 'MicroGoals User',
          email: 'microgoals@example.com',
          password: password
        });
        
        return newUser.save();
      }
      return user;
    })
    .then(user => {
      console.log('Default user available:', user._id.toString());
    })
    .catch(err => {
      console.error('Error with default user:', err);
    });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Add auth middleware
const auth = require('./middleware/auth');

// Routes
app.use('/api/goals', auth, require('./routes/goalRoutes'));
app.use('/api/users', auth, require('./routes/userRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('MicroGoals API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
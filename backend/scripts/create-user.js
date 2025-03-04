// scripts/create-user.js
// Run this script to create a test user
const axios = require('axios');

async function createUser() {
  try {
    const response = await axios.post('http://localhost:3000/api/users/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('User created successfully!');
    console.log('User ID:', response.data.id);
    console.log('Use this ID in your Raycast extension preferences');
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
  }
}

createUser();
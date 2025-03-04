// File: backend/middleware/auth.js
module.exports = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };
require('dotenv').config(); // MUST be loaded at the very top
const express = require('express');
const cors = require('cors');

const app = express();

// Parse comma-separated string from .env into an array
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) 
  : [];

// Configure CORS middleware options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  optionsSuccessStatus: 200 // For legacy browser support (IE11)
};

// Apply CORS middleware before your API routes
app.use(cors(corsOptions));

app.get('/api/data', (req, res) => {
  res.json({ message: "Hello, this data is CORS-safe!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

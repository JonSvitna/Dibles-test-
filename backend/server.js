require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Railway backend!' });
});

// County tests endpoint (based on README)
app.get('/api/county-tests', (req, res) => {
  res.json({ 
    message: 'County tests endpoint',
    data: [
      { id: 1, county: 'Sample County', testCount: 42 },
      { id: 2, county: 'Test County', testCount: 15 }
    ]
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

process.env.TZ = process.env.TZ || 'Asia/Jakarta';

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//For uploading files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Logging Request
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.path} - Content-Type: ${req.get('Content-Type') || 'N/A'}`);
  next();
});

//Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API LapanganKita berjalan dengan baik!',
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      success: true,
      message: 'Successfully connected to the server',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'Connected' : 'Disconnected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Disconnected from the server',
      error: error.message
    });
  }
});
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Warning: Database connection failed, but server will still start');
    } else {
      // Start the booking auto-complete scheduler only if DB is connected
      BookingScheduler.startScheduler();
    }

    app.listen(PORT, () => {
      console.log('🚀 Server running successfully!');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Local URL: http://localhost:${PORT}`);
      console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
      console.log('====================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

module.exports = app;
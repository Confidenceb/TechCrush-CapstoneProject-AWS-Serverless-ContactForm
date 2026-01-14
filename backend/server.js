require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');           // Auth routes
const uploadRoutes = require('./routes/upload');       // File upload route
const protectedRoutes = require('./routes/protected'); // Protected route
const filesRoutes = require('./routes/files');         // Files preview routes
const profileRoutes = require('./routes/profile');     // Profile routes (NEW)

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // allow cookies or auth headers
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/profile', profileRoutes);  // NEW ROUTE

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
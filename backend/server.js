const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const database = require('../backend/config/db');
const eventRoutes = require('./routes/events');
const authRoutes = require('../backend/routes/auth');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
//app.use(bodyParser.json());


// Connect to MongoDB
database();

// Routes
app.use('/api/v1/auth', authRoutes); // Auth-related routes
app.use('/api/v1/events', eventRoutes); // Event-related routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

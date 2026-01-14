const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error');
const authRoutes = require('./modules/auth/auth.routes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);

// Error handler middleware
app.use(errorHandler);

module.exports = app;

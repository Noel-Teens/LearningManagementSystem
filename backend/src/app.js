const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/error');
const authRoutes = require('./modules/auth/auth.routes');
const organizationRoutes = require('./modules/organization/organization.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const authroutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/auth", authroutes);
app.use("/api/articles", articleRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Error handler middleware
app.use(errorHandler);

module.exports = app;

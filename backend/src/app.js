const express = require('express');
const cors = require('cors');
const path = require("path");
const errorHandler = require('./middlewares/error');
const authRoutes = require('./modules/auth/auth.routes');
const organizationRoutes = require('./modules/organization/organization.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const courseRoutes = require('./modules/courses/course.routes');
const articleRoutes = require("./modules/article/article.routes");
const enrollmentRoutes = require("./modules/Enrollment/enrollment.routes");
const certificationRoutes = require("./modules/certification/certification.routes");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/courses', courseRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/certifications", certificationRoutes);

app.use(express.urlencoded({ extended: true, limit: "100mb" }));
// Health check endpoint
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

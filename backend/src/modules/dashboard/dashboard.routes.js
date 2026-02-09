const express = require('express');
const {
    getAdminDashboard,
    getTrainerDashboard,
    getLearnerDashboard,
    getDashboardStats,
} = require('./dashboard.controller');

const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// Admin dashboard - SuperAdmin and Admin access
router.get('/admin', protect, authorize('SuperAdmin', 'Admin'), getAdminDashboard);

// Trainer dashboard - Trainer access
router.get('/trainer', protect, authorize('Trainer'), getTrainerDashboard);

// Learner dashboard - Learner access
router.get('/learner', protect, authorize('Learner'), getLearnerDashboard);

// General dashboard stats - All authenticated users
router.get('/stats', protect, getDashboardStats);

module.exports = router;

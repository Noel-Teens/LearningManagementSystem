const express = require('express');
const router = express.Router();

const {
    getAdminOverview,
    exportReport,
    getTrainerCourses,
    getCourseAnalytics
} = require('./reports.controller');

const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// =============================================================================
// ADMIN ROUTES - Organization-Wide Reports
// =============================================================================

router.get('/admin/overview', protect, authorize('Admin', 'SuperAdmin'), getAdminOverview);
router.get('/admin/export/:type', protect, authorize('Admin', 'SuperAdmin'), exportReport);

// =============================================================================
// TRAINER ROUTES - Course-Level Analytics
// =============================================================================

router.get('/trainer/courses', protect, authorize('Trainer'), getTrainerCourses);
router.get('/trainer/courses/:courseId', protect, authorize('Trainer'), getCourseAnalytics);

module.exports = router;

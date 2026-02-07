const express = require('express');
const router = express.Router();

const {
    // Admin APIs
    enrollLearner,
    removeEnrollment,
    getEnrolledLearners,
    getAllEnrollments,
    // Learner APIs
    getEnrolledCourses,
    getCourseLearningStructure,
    markLessonComplete,
    getCourseProgress,
    resumeLearning,
    updateLastAccessed
} = require('./enrollment.controller');

const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// =============================================================================
// ADMIN ROUTES - Enrollment Management
// =============================================================================

// All admin routes require Admin or SuperAdmin role
router.use('/admin', protect, authorize('Admin', 'SuperAdmin'));

// Enroll a learner to a course
router.post('/admin/enroll', enrollLearner);

// Get all enrollments (overview)
router.get('/admin/all', getAllEnrollments);

// Get enrolled learners for a specific course
router.get('/admin/course/:courseId', getEnrolledLearners);

// Remove an enrollment
router.delete('/admin/:enrollmentId', removeEnrollment);

// =============================================================================
// LEARNER ROUTES - Learning & Progress
// =============================================================================

// All learner routes require Learner role
router.use('/learner', protect, authorize('Learner'));

// Get all enrolled courses for the learner
router.get('/learner/courses', getEnrolledCourses);

// Get course learning structure with modules/lessons
router.get('/learner/courses/:courseId/learn', getCourseLearningStructure);

// Get course progress
router.get('/learner/courses/:courseId/progress', getCourseProgress);

// Resume learning (get last accessed lesson)
router.get('/learner/courses/:courseId/resume', resumeLearning);

// Mark a lesson as completed
router.post('/learner/courses/:courseId/lessons/:lessonId/complete', markLessonComplete);

// Update last accessed lesson (tracking)
router.post('/learner/courses/:courseId/lessons/:lessonId/access', updateLastAccessed);

module.exports = router;

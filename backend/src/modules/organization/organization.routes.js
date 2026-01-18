const express = require('express');
const {
    createOrganization,
    getOrganizations,
    updateOrganization,
    updateTheme,
    updateLearningPolicies,
    uploadLogo,
} = require('./organization.controller');

const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// CRUD routes
router
    .route('/')
    .get(protect, authorize('SuperAdmin', 'Admin'), getOrganizations)
    .post(protect, authorize('SuperAdmin'), createOrganization);

router
    .route('/:id')
    .put(protect, authorize('SuperAdmin', 'Admin'), updateOrganization);

// Specialized routes
router.put('/:id/theme', protect, authorize('SuperAdmin', 'Admin'), updateTheme);
router.put('/:id/policies', protect, authorize('SuperAdmin', 'Admin'), updateLearningPolicies);
router.put('/:id/logo', protect, authorize('SuperAdmin', 'Admin'), uploadLogo);

module.exports = router;

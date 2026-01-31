const express = require("express");
const router = express.Router();

const certificateController = require("./certification.controller");
// optional middlewares if you want to protect routes later
const authMiddleware = require("../../middlewares/auth.middleware");
// const roleMiddleware = require("../../middlewares/role.middleware");

/**
 * Generate certificate
 * Triggered when course progress reaches 100%
 * POST /api/certificates/generate
 */
router.post(
  "/generate",
  // authMiddleware,
  // roleMiddleware(["Learner", "Admin"]),
  certificateController.generateCertificate
);

/**
 * Get all certificates for a user
 * GET /api/certifications/user/:userId
 */
router.get(
  "/user/:userId",
  // authMiddleware,
  certificateController.getUserCertificates
);

/**
 * Verify certificate authenticity
 * GET /api/certifications/verify/:certificateId
 */
router.get(
  "/verify/:certificateId",
  certificateController.verifyCertificate
);

/**
 * Get a single certificate by ID
 * GET /api/certifications/:certificateId
 */
router.get(
  "/:certificateId",
  // authMiddleware,
  certificateController.getCertificate
);

module.exports = router;

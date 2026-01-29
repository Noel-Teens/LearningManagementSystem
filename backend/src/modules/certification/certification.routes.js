const express = require("express");
const router = express.Router();

const certificateController = require("./certification.controller");
// optional middlewares if you want to protect routes later
// const authMiddleware = require("../../middlewares/auth.middleware");
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
 * GET /api/certificates/user/:userId
 */
router.get(
  "/user/:userId",
  // authMiddleware,
  certificateController.getUserCertificates
);

module.exports = router;

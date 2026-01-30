const Certificate = require("./certification.model");
const Enrollment = require("../Enrollment/enrollment.model");
const Course = require("../courses/course.model");
const User = require("../auth/user.model");
const { generateCertificatePDF } = require("./certification.utils");

/**
 * Generate certificate when course is completed
 * POST /api/certificates/generate
 */
exports.generateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // 1. Check enrollment
    const enrollment = await Enrollment.findOne({ userId, courseId });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    // 2. Check course completion
    if (enrollment.progress < 100) {
      return res.status(400).json({
        success: false,
        message: "Course not completed yet"
      });
    }

    // 3. Prevent duplicate certificates
    const existingCertificate = await Certificate.findOne({ userId, courseId });
    if (existingCertificate) {
      return res.status(200).json({
        success: true,
        message: "Certificate already generated",
        data: existingCertificate
      });
    }

    // 4. Fetch course details (for display purposes)
    const course = await Course.findById(courseId).select("title");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // 5. Generate certificate URL (placeholder for now)
    // Fetch user for name
    const user = await User.findById(userId).select("name");
    // Generate PDF
    const pdfFileName = await generateCertificatePDF({
        userName: user.name,
        courseTitle: course.title,
        certificateId: `${userId}_${courseId}`
    });
    const certificateUrl = `/uploads/certificates/${pdfFileName}`;

    // 6. Save certificate
    const certificate = await Certificate.create({
      userId,
      courseId,
      certificateUrl,
      issuedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: "Certificate generated successfully",
      data: {
        certificateId: certificate._id,
        courseTitle: course.title,
        issuedAt: certificate.issuedAt,
        certificateUrl: certificate.certificateUrl
      }
    });

  } catch (error) {
    console.error("Certificate Generation Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating certificate"
    });
  }
};

/**
 * Get certificates for a user
 * GET /api/certificates/user/:userId
 */
exports.getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;

    const certificates = await Certificate.find({ userId })
      .populate("courseId", "title")
      .sort({ issuedAt: -1 });

    return res.status(200).json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error("Fetch Certificates Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching certificates"
    });
  }
};
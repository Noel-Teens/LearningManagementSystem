const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    createCourse,
    getCourses,
    getCourse,
    updateCourse,
    togglePublishStatus,
    softDeleteCourse,
    restoreCourse,
    getTrashBin,
    permanentDeleteCourse,
    addModule,
    updateModule,
    softDeleteModule,
    restoreModule,
    addLesson,
    updateLesson,
    softDeleteLesson,
    restoreLesson,
    uploadFile,
} = require('./course.controller');

const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

// Configure multer for memory storage (for Cloudinary uploads)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit for videos
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'video/mp4',
            'video/webm',
            'video/quicktime',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and video files are allowed.'), false);
        }
    },
});

// All routes require authentication
router.use(protect);

// =============================================================================
// FILE UPLOAD (Trainer only)
// =============================================================================
router.post('/upload', authorize('Trainer'), upload.single('file'), uploadFile);

// =============================================================================
// TRASH BIN (Trainer only)
// =============================================================================
router.get('/trash', authorize('Trainer'), getTrashBin);

// =============================================================================
// COURSE ROUTES
// =============================================================================
router.route('/')
    .get(authorize('Trainer', 'Admin', 'SuperAdmin'), getCourses)
    .post(authorize('Trainer'), createCourse);

router.route('/:courseId')
    .get(authorize('Trainer', 'Admin', 'SuperAdmin'), getCourse)
    .put(authorize('Trainer'), updateCourse)
    .delete(authorize('Trainer'), softDeleteCourse);

router.patch('/:courseId/publish', authorize('Trainer'), togglePublishStatus);
router.patch('/:courseId/restore', authorize('Trainer'), restoreCourse);
router.delete('/:courseId/permanent', authorize('Trainer'), permanentDeleteCourse);

// =============================================================================
// MODULE ROUTES (Trainer only)
// =============================================================================
router.post('/:courseId/modules', authorize('Trainer'), addModule);
router.put('/:courseId/modules/:moduleId', authorize('Trainer'), updateModule);
router.delete('/:courseId/modules/:moduleId', authorize('Trainer'), softDeleteModule);
router.patch('/:courseId/modules/:moduleId/restore', authorize('Trainer'), restoreModule);

// =============================================================================
// LESSON ROUTES (Trainer only)
// =============================================================================
router.post('/:courseId/modules/:moduleId/lessons', authorize('Trainer'), addLesson);
router.put('/:courseId/modules/:moduleId/lessons/:lessonId', authorize('Trainer'), updateLesson);
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', authorize('Trainer'), softDeleteLesson);
router.patch('/:courseId/modules/:moduleId/lessons/:lessonId/restore', authorize('Trainer'), restoreLesson);

module.exports = router;

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

// All routes require authentication and Trainer role
router.use(protect);
router.use(authorize('Trainer'));

// =============================================================================
// FILE UPLOAD
// =============================================================================
router.post('/upload', upload.single('file'), uploadFile);

// =============================================================================
// TRASH BIN (must be before /:courseId to avoid conflict)
// =============================================================================
router.get('/trash', getTrashBin);

// =============================================================================
// COURSE ROUTES
// =============================================================================
router.route('/')
    .get(getCourses)
    .post(createCourse);

router.route('/:courseId')
    .get(getCourse)
    .put(updateCourse)
    .delete(softDeleteCourse);

router.patch('/:courseId/publish', togglePublishStatus);
router.patch('/:courseId/restore', restoreCourse);
router.delete('/:courseId/permanent', permanentDeleteCourse);

// =============================================================================
// MODULE ROUTES
// =============================================================================
router.post('/:courseId/modules', addModule);
router.put('/:courseId/modules/:moduleId', updateModule);
router.delete('/:courseId/modules/:moduleId', softDeleteModule);
router.patch('/:courseId/modules/:moduleId/restore', restoreModule);

// =============================================================================
// LESSON ROUTES
// =============================================================================
router.post('/:courseId/modules/:moduleId/lessons', addLesson);
router.put('/:courseId/modules/:moduleId/lessons/:lessonId', updateLesson);
router.delete('/:courseId/modules/:moduleId/lessons/:lessonId', softDeleteLesson);
router.patch('/:courseId/modules/:moduleId/lessons/:lessonId/restore', restoreLesson);

module.exports = router;

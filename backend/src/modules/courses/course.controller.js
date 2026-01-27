const Course = require('./course.model');
const cloudinary = require('../../config/cloudinary');
const ErrorResponse = require('../../utils/errorHandler');

// =============================================================================
// COURSE CRUD
// =============================================================================

/**
 * @desc    Create a new course (Draft by default)
 * @route   POST /api/courses
 * @access  Private/Trainer
 */
exports.createCourse = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const course = await Course.create({
            title,
            description,
            trainerId: req.user._id,
            status: 'Draft',
        });

        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all active courses (non-deleted) for the trainer
 * @route   GET /api/courses
 * @access  Private/Trainer
 */
exports.getCourses = async (req, res, next) => {
    try {
        let query = { isDeleted: false };

        // If user is Trainer, only show their courses
        if (req.user.role === 'Trainer') {
            query.trainerId = req.user._id;
        }
        // If Admin/SuperAdmin, they see all courses (query remains without trainerId)

        const courses = await Course.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single course by ID
 * @route   GET /api/courses/:courseId
 * @access  Private/Trainer
 */
exports.getCourse = async (req, res, next) => {
    try {
        let query = {
            _id: req.params.courseId,
            isDeleted: false,
        };

        // If Trainer, restrict to own course
        if (req.user.role === 'Trainer') {
            query.trainerId = req.user._id;
        }

        const course = await Course.findOne(query);

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update course details
 * @route   PUT /api/courses/:courseId
 * @access  Private/Trainer
 */
exports.updateCourse = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const course = await Course.findOneAndUpdate(
            {
                _id: req.params.courseId,
                trainerId: req.user._id,
                isDeleted: false,
            },
            { title, description },
            { new: true, runValidators: true }
        );

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Toggle course publish status (Draft <-> Published)
 * @route   PATCH /api/courses/:courseId/publish
 * @access  Private/Trainer
 */
exports.togglePublishStatus = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        course.status = course.status === 'Draft' ? 'Published' : 'Draft';
        await course.save();

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Soft delete a course (move to Trash Bin)
 * @route   DELETE /api/courses/:courseId
 * @access  Private/Trainer
 */
exports.softDeleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findOneAndUpdate(
            {
                _id: req.params.courseId,
                trainerId: req.user._id,
                isDeleted: false,
            },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Course moved to Trash Bin',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Restore a course from Trash Bin
 * @route   PATCH /api/courses/:courseId/restore
 * @access  Private/Trainer
 */
exports.restoreCourse = async (req, res, next) => {
    try {
        const course = await Course.findOneAndUpdate(
            {
                _id: req.params.courseId,
                trainerId: req.user._id,
                isDeleted: true,
            },
            { isDeleted: false, deletedAt: null },
            { new: true }
        );

        if (!course) {
            return next(new ErrorResponse('Course not found in Trash Bin', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Course restored successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get Trash Bin items (soft-deleted courses)
 * @route   GET /api/courses/trash
 * @access  Private/Trainer
 */
exports.getTrashBin = async (req, res, next) => {
    try {
        const courses = await Course.find({
            trainerId: req.user._id,
            isDeleted: true,
        }).sort({ deletedAt: -1 });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Permanently delete a course from Trash Bin
 * @route   DELETE /api/courses/:courseId/permanent
 * @access  Private/Trainer
 */
exports.permanentDeleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findOneAndDelete({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: true,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found in Trash Bin', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Course permanently deleted',
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================================
// MODULE CRUD (within a Course)
// =============================================================================

/**
 * @desc    Add a module to a course
 * @route   POST /api/courses/:courseId/modules
 * @access  Private/Trainer
 */
exports.addModule = async (req, res, next) => {
    try {
        const { title } = req.body;

        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        // Calculate order for new module
        const activeModules = course.modules.filter(m => !m.isDeleted);
        const order = activeModules.length;

        course.modules.push({ title, order });
        await course.save();

        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a module
 * @route   PUT /api/courses/:courseId/modules/:moduleId
 * @access  Private/Trainer
 */
exports.updateModule = async (req, res, next) => {
    try {
        const { title, order } = req.body;

        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || module.isDeleted) {
            return next(new ErrorResponse('Module not found', 404));
        }

        if (title !== undefined) module.title = title;
        if (order !== undefined) module.order = order;

        await course.save();

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Soft delete a module
 * @route   DELETE /api/courses/:courseId/modules/:moduleId
 * @access  Private/Trainer
 */
exports.softDeleteModule = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || module.isDeleted) {
            return next(new ErrorResponse('Module not found', 404));
        }

        module.isDeleted = true;
        module.deletedAt = new Date();

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Module moved to Trash Bin',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Restore a module from Trash Bin
 * @route   PATCH /api/courses/:courseId/modules/:moduleId/restore
 * @access  Private/Trainer
 */
exports.restoreModule = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || !module.isDeleted) {
            return next(new ErrorResponse('Module not found in Trash Bin', 404));
        }

        module.isDeleted = false;
        module.deletedAt = null;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Module restored successfully',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================================
// LESSON CRUD (within a Module)
// =============================================================================

/**
 * @desc    Add a lesson to a module
 * @route   POST /api/courses/:courseId/modules/:moduleId/lessons
 * @access  Private/Trainer
 */
exports.addLesson = async (req, res, next) => {
    try {
        const { title, contentType, contentUrl } = req.body;

        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || module.isDeleted) {
            return next(new ErrorResponse('Module not found', 404));
        }

        // Calculate order for new lesson
        const activeLessons = module.lessons.filter(l => !l.isDeleted);
        const order = activeLessons.length;

        module.lessons.push({ title, contentType, contentUrl, order });
        await course.save();

        res.status(201).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a lesson
 * @route   PUT /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
 * @access  Private/Trainer
 */
exports.updateLesson = async (req, res, next) => {
    try {
        const { title, contentType, contentUrl, order } = req.body;

        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || module.isDeleted) {
            return next(new ErrorResponse('Module not found', 404));
        }

        const lesson = module.lessons.id(req.params.lessonId);
        if (!lesson || lesson.isDeleted) {
            return next(new ErrorResponse('Lesson not found', 404));
        }

        if (title !== undefined) lesson.title = title;
        if (contentType !== undefined) lesson.contentType = contentType;
        if (contentUrl !== undefined) lesson.contentUrl = contentUrl;
        if (order !== undefined) lesson.order = order;

        await course.save();

        res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Soft delete a lesson
 * @route   DELETE /api/courses/:courseId/modules/:moduleId/lessons/:lessonId
 * @access  Private/Trainer
 */
exports.softDeleteLesson = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || module.isDeleted) {
            return next(new ErrorResponse('Module not found', 404));
        }

        const lesson = module.lessons.id(req.params.lessonId);
        if (!lesson || lesson.isDeleted) {
            return next(new ErrorResponse('Lesson not found', 404));
        }

        lesson.isDeleted = true;
        lesson.deletedAt = new Date();

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lesson deleted',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Restore a lesson
 * @route   PATCH /api/courses/:courseId/modules/:moduleId/lessons/:lessonId/restore
 * @access  Private/Trainer
 */
exports.restoreLesson = async (req, res, next) => {
    try {
        const course = await Course.findOne({
            _id: req.params.courseId,
            trainerId: req.user._id,
            isDeleted: false,
        });

        if (!course) {
            return next(new ErrorResponse('Course not found', 404));
        }

        const module = course.modules.id(req.params.moduleId);
        if (!module || module.isDeleted) {
            return next(new ErrorResponse('Module not found', 404));
        }

        const lesson = module.lessons.id(req.params.lessonId);
        if (!lesson || !lesson.isDeleted) {
            return next(new ErrorResponse('Lesson not found in deleted items', 404));
        }

        lesson.isDeleted = false;
        lesson.deletedAt = null;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lesson restored',
            data: course,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================================
// FILE UPLOAD (PDF / Video to Cloudinary)
// =============================================================================

/**
 * @desc    Upload a file (PDF or Video) to Cloudinary for a lesson
 * @route   POST /api/courses/upload
 * @access  Private/Trainer
 */
exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        // Determine resource type based on mimetype
        const isPdf = req.file.mimetype === 'application/pdf';
        const isVideo = req.file.mimetype.startsWith('video/');

        if (!isPdf && !isVideo) {
            return next(new ErrorResponse('Only PDF and Video files are allowed', 400));
        }

        // Convert buffer to base64 data URI
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'lms/lessons',
            resource_type: isPdf ? 'raw' : 'video',
        });

        res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                contentType: isPdf ? 'PDF' : 'Video',
            },
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        next(new ErrorResponse('File upload failed', 500));
    }
};

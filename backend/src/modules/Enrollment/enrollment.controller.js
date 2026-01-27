const Enrollment = require('./enrollment.model');
const Course = require('../courses/course.model');
const User = require('../auth/user.model');

// =============================================================================
// ADMIN APIs - Enrollment Management
// =============================================================================

/**
 * @desc    Enroll a learner to a course
 * @route   POST /api/enrollments/admin/enroll
 * @access  Private/Admin
 */
exports.enrollLearner = async (req, res, next) => {
    try {
        const { learnerId, courseId } = req.body;

        // Validate required fields
        if (!learnerId || !courseId) {
            return res.status(400).json({
                success: false,
                error: 'learnerId and courseId are required'
            });
        }

        // Verify learner exists and is a Learner role
        const learner = await User.findById(learnerId);
        if (!learner) {
            return res.status(404).json({
                success: false,
                error: 'Learner not found'
            });
        }
        if (learner.role !== 'Learner') {
            return res.status(400).json({
                success: false,
                error: 'User is not a Learner'
            });
        }

        // Verify course exists and is published
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }
        if (course.isDeleted) {
            return res.status(400).json({
                success: false,
                error: 'Cannot enroll in a deleted course'
            });
        }
        if (course.status !== 'Published') {
            return res.status(400).json({
                success: false,
                error: 'Cannot enroll in an unpublished course'
            });
        }

        // Check for duplicate enrollment
        const existingEnrollment = await Enrollment.findOne({ learnerId, courseId });
        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                error: 'Learner is already enrolled in this course'
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            learnerId,
            courseId,
            enrolledBy: req.user._id
        });

        // Populate and return
        const populatedEnrollment = await Enrollment.findById(enrollment._id)
            .populate('learnerId', 'name email')
            .populate('courseId', 'title description status')
            .populate('enrolledBy', 'name');

        res.status(201).json({
            success: true,
            data: populatedEnrollment
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Learner is already enrolled in this course'
            });
        }
        next(error);
    }
};

/**
 * @desc    Remove a learner from a course
 * @route   DELETE /api/enrollments/admin/:enrollmentId
 * @access  Private/Admin
 */
exports.removeEnrollment = async (req, res, next) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                error: 'Enrollment not found'
            });
        }

        await Enrollment.findByIdAndDelete(req.params.enrollmentId);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all enrolled learners for a course
 * @route   GET /api/enrollments/admin/course/:courseId
 * @access  Private/Admin
 */
exports.getEnrolledLearners = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found'
            });
        }

        const enrollments = await Enrollment.find({ courseId })
            .populate('learnerId', 'name email isActive')
            .populate('enrolledBy', 'name')
            .sort({ enrolledAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all enrollments (Admin overview)
 * @route   GET /api/enrollments/admin/all
 * @access  Private/Admin
 */
exports.getAllEnrollments = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('learnerId', 'name email isActive')
            .populate('courseId', 'title status')
            .populate('enrolledBy', 'name')
            .sort({ enrolledAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================================
// LEARNER APIs - Learning & Progress
// =============================================================================

/**
 * @desc    Get enrolled courses for the logged-in learner
 * @route   GET /api/enrollments/learner/courses
 * @access  Private/Learner
 */
exports.getEnrolledCourses = async (req, res, next) => {
    try {
        const enrollments = await Enrollment.find({ learnerId: req.user._id })
            .populate({
                path: 'courseId',
                select: 'title description status modules',
                match: { isDeleted: false, status: 'Published' }
            })
            .sort({ 'progress.lastAccessedAt': -1, enrolledAt: -1 });

        // Filter out enrollments where course was deleted/unpublished
        const validEnrollments = enrollments.filter(e => e.courseId !== null);

        // Transform data for frontend
        const courses = validEnrollments.map(enrollment => ({
            enrollmentId: enrollment._id,
            course: {
                _id: enrollment.courseId._id,
                title: enrollment.courseId.title,
                description: enrollment.courseId.description,
                moduleCount: enrollment.courseId.modules?.filter(m => !m.isDeleted).length || 0,
                lessonCount: enrollment.courseId.modules?.reduce((acc, m) => {
                    if (m.isDeleted) return acc;
                    return acc + (m.lessons?.filter(l => !l.isDeleted).length || 0);
                }, 0) || 0
            },
            progress: enrollment.progress,
            enrolledAt: enrollment.enrolledAt,
            status: enrollment.status,
            completedAt: enrollment.completedAt
        }));

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get course learning structure with progress
 * @route   GET /api/enrollments/learner/courses/:courseId/learn
 * @access  Private/Learner
 */
exports.getCourseLearningStructure = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        // Verify enrollment
        const enrollment = await Enrollment.findOne({
            learnerId: req.user._id,
            courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                error: 'You are not enrolled in this course'
            });
        }

        // Get course with full structure
        const course = await Course.findOne({
            _id: courseId,
            isDeleted: false,
            status: 'Published'
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found or not published'
            });
        }

        // Build learning structure with progress
        const modules = course.modules
            .filter(m => !m.isDeleted)
            .sort((a, b) => a.order - b.order)
            .map(module => {
                const lessons = module.lessons
                    .filter(l => !l.isDeleted)
                    .sort((a, b) => a.order - b.order)
                    .map(lesson => ({
                        _id: lesson._id,
                        title: lesson.title,
                        contentType: lesson.contentType,
                        contentUrl: lesson.contentUrl,
                        order: lesson.order,
                        isCompleted: enrollment.isLessonCompleted(lesson._id)
                    }));

                const completedLessons = lessons.filter(l => l.isCompleted).length;
                const totalLessons = lessons.length;

                return {
                    _id: module._id,
                    title: module.title,
                    order: module.order,
                    lessons,
                    isCompleted: enrollment.isModuleCompleted(module._id),
                    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
                    completedLessons,
                    totalLessons
                };
            });

        // Update last accessed
        enrollment.progress.lastAccessedAt = new Date();
        await enrollment.save();

        res.status(200).json({
            success: true,
            data: {
                course: {
                    _id: course._id,
                    title: course.title,
                    description: course.description
                },
                modules,
                progress: enrollment.progress,
                status: enrollment.status
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark a lesson as completed
 * @route   POST /api/enrollments/learner/courses/:courseId/lessons/:lessonId/complete
 * @access  Private/Learner
 */
exports.markLessonComplete = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;

        // Verify enrollment
        const enrollment = await Enrollment.findOne({
            learnerId: req.user._id,
            courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                error: 'You are not enrolled in this course'
            });
        }

        // Get course for validation and progress calculation
        const course = await Course.findOne({
            _id: courseId,
            isDeleted: false,
            status: 'Published'
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found or not published'
            });
        }

        // Find the lesson in the course
        let lessonFound = false;
        let moduleId = null;

        for (const module of course.modules) {
            if (module.isDeleted) continue;
            for (const lesson of module.lessons) {
                if (!lesson.isDeleted && lesson._id.toString() === lessonId) {
                    lessonFound = true;
                    moduleId = module._id;
                    break;
                }
            }
            if (lessonFound) break;
        }

        if (!lessonFound) {
            return res.status(404).json({
                success: false,
                error: 'Lesson not found in course'
            });
        }

        // Check if already completed
        if (enrollment.isLessonCompleted(lessonId)) {
            return res.status(200).json({
                success: true,
                message: 'Lesson already completed',
                data: {
                    progress: enrollment.progress
                }
            });
        }

        // Mark lesson as completed
        enrollment.progress.completedLessons.push(lessonId);
        enrollment.progress.lastAccessedLessonId = lessonId;
        enrollment.progress.lastAccessedModuleId = moduleId;
        enrollment.progress.lastAccessedAt = new Date();

        // Recalculate progress
        enrollment.calculateProgress(course);

        await enrollment.save();

        res.status(200).json({
            success: true,
            message: 'Lesson marked as completed',
            data: {
                progress: enrollment.progress,
                status: enrollment.status
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get detailed course progress
 * @route   GET /api/enrollments/learner/courses/:courseId/progress
 * @access  Private/Learner
 */
exports.getCourseProgress = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const enrollment = await Enrollment.findOne({
            learnerId: req.user._id,
            courseId
        }).populate('courseId', 'title');

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                error: 'You are not enrolled in this course'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                courseTitle: enrollment.courseId.title,
                progress: enrollment.progress,
                status: enrollment.status,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get resume learning info (last accessed lesson)
 * @route   GET /api/enrollments/learner/courses/:courseId/resume
 * @access  Private/Learner
 */
exports.resumeLearning = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const enrollment = await Enrollment.findOne({
            learnerId: req.user._id,
            courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                error: 'You are not enrolled in this course'
            });
        }

        // Get course to find first lesson if no last accessed
        const course = await Course.findOne({
            _id: courseId,
            isDeleted: false,
            status: 'Published'
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found or not published'
            });
        }

        let resumeLesson = null;
        let resumeModule = null;

        if (enrollment.progress.lastAccessedLessonId) {
            // Find the last accessed lesson
            for (const module of course.modules) {
                if (module.isDeleted) continue;
                for (const lesson of module.lessons) {
                    if (!lesson.isDeleted &&
                        lesson._id.toString() === enrollment.progress.lastAccessedLessonId.toString()) {
                        resumeLesson = {
                            _id: lesson._id,
                            title: lesson.title,
                            contentType: lesson.contentType
                        };
                        resumeModule = {
                            _id: module._id,
                            title: module.title
                        };
                        break;
                    }
                }
                if (resumeLesson) break;
            }
        }

        // If no last accessed or not found, get first lesson
        if (!resumeLesson) {
            const sortedModules = course.modules
                .filter(m => !m.isDeleted)
                .sort((a, b) => a.order - b.order);

            if (sortedModules.length > 0) {
                const firstModule = sortedModules[0];
                const sortedLessons = firstModule.lessons
                    .filter(l => !l.isDeleted)
                    .sort((a, b) => a.order - b.order);

                if (sortedLessons.length > 0) {
                    resumeLesson = {
                        _id: sortedLessons[0]._id,
                        title: sortedLessons[0].title,
                        contentType: sortedLessons[0].contentType
                    };
                    resumeModule = {
                        _id: firstModule._id,
                        title: firstModule.title
                    };
                }
            }
        }

        res.status(200).json({
            success: true,
            data: {
                lesson: resumeLesson,
                module: resumeModule,
                lastAccessedAt: enrollment.progress.lastAccessedAt,
                courseProgress: enrollment.progress.courseProgress
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update last accessed lesson (for tracking)
 * @route   POST /api/enrollments/learner/courses/:courseId/lessons/:lessonId/access
 * @access  Private/Learner
 */
exports.updateLastAccessed = async (req, res, next) => {
    try {
        const { courseId, lessonId } = req.params;

        const enrollment = await Enrollment.findOne({
            learnerId: req.user._id,
            courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                success: false,
                error: 'You are not enrolled in this course'
            });
        }

        // Find module for the lesson
        const course = await Course.findById(courseId);
        let moduleId = null;

        for (const module of course.modules) {
            if (module.isDeleted) continue;
            for (const lesson of module.lessons) {
                if (!lesson.isDeleted && lesson._id.toString() === lessonId) {
                    moduleId = module._id;
                    break;
                }
            }
            if (moduleId) break;
        }

        enrollment.progress.lastAccessedLessonId = lessonId;
        enrollment.progress.lastAccessedModuleId = moduleId;
        enrollment.progress.lastAccessedAt = new Date();
        await enrollment.save();

        res.status(200).json({
            success: true,
            data: {
                lastAccessedLessonId: lessonId,
                lastAccessedAt: enrollment.progress.lastAccessedAt
            }
        });
    } catch (error) {
        next(error);
    }
};

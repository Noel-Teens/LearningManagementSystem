const Enrollment = require('../Enrollment/enrollment.model');
const Course = require('../courses/course.model');
const User = require('../auth/user.model');

// =============================================================================
// ADMIN APIs - Organization-Wide Reports
// =============================================================================

/**
 * @desc    Get organization-wide overview report
 * @route   GET /api/reports/admin/overview
 * @access  Private/Admin, SuperAdmin
 */
exports.getAdminOverview = async (req, res, next) => {
    try {
        // --- User Stats ---
        const totalUsers = await User.countDocuments();
        const usersByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        const activeUsers = await User.countDocuments({ isActive: true });

        // --- Course Stats ---
        const totalCourses = await Course.countDocuments({ isDeleted: false });
        const publishedCourses = await Course.countDocuments({ isDeleted: false, status: 'Published' });
        const draftCourses = await Course.countDocuments({ isDeleted: false, status: 'Draft' });

        // --- Enrollment Stats ---
        const totalEnrollments = await Enrollment.countDocuments();
        const enrollmentsByStatus = await Enrollment.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // --- Progress Stats ---
        const progressStats = await Enrollment.aggregate([
            {
                $group: {
                    _id: null,
                    avgProgress: { $avg: '$progress.courseProgress' },
                    totalCompleted: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    totalActive: {
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                    },
                    totalDropped: {
                        $sum: { $cond: [{ $eq: ['$status', 'dropped'] }, 1, 0] }
                    }
                }
            }
        ]);

        // --- Top Courses by Enrollment ---
        const topCourses = await Enrollment.aggregate([
            { $group: { _id: '$courseId', enrollmentCount: { $sum: 1 }, avgProgress: { $avg: '$progress.courseProgress' } } },
            { $sort: { enrollmentCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $project: {
                    _id: 1,
                    enrollmentCount: 1,
                    avgProgress: { $round: ['$avgProgress', 1] },
                    courseTitle: '$course.title',
                    courseStatus: '$course.status'
                }
            }
        ]);

        // --- Recent Enrollments ---
        const recentEnrollments = await Enrollment.find()
            .populate('learnerId', 'name email')
            .populate('courseId', 'title')
            .populate('enrolledBy', 'name')
            .sort({ enrolledAt: -1 })
            .limit(10);

        // --- Monthly Enrollment Trend (last 6 months) ---
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const enrollmentTrend = await Enrollment.aggregate([
            { $match: { enrolledAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$enrolledAt' },
                        month: { $month: '$enrolledAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const stats = progressStats[0] || {
            avgProgress: 0,
            totalCompleted: 0,
            totalActive: 0,
            totalDropped: 0
        };

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    byRole: usersByRole
                },
                courses: {
                    total: totalCourses,
                    published: publishedCourses,
                    draft: draftCourses
                },
                enrollments: {
                    total: totalEnrollments,
                    byStatus: enrollmentsByStatus,
                    completed: stats.totalCompleted,
                    active: stats.totalActive,
                    dropped: stats.totalDropped
                },
                progress: {
                    avgProgress: Math.round((stats.avgProgress || 0) * 10) / 10
                },
                topCourses,
                recentEnrollments,
                enrollmentTrend
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Export report data as CSV
 * @route   GET /api/reports/admin/export/:type
 * @access  Private/Admin, SuperAdmin
 */
exports.exportReport = async (req, res, next) => {
    try {
        const { type } = req.params;
        let csvContent = '';
        let filename = '';

        switch (type) {
            case 'users': {
                const users = await User.find().select('name email role isActive createdAt');
                csvContent = 'Name,Email,Role,Active,Created At\n';
                users.forEach(u => {
                    csvContent += `"${u.name}","${u.email}","${u.role}","${u.isActive}","${u.createdAt ? u.createdAt.toISOString() : ''}"\n`;
                });
                filename = 'users_report.csv';
                break;
            }
            case 'courses': {
                const courses = await Course.find({ isDeleted: false })
                    .populate('trainerId', 'name email');
                csvContent = 'Title,Status,Trainer,Modules Count,Created At\n';
                courses.forEach(c => {
                    const activeModules = c.modules ? c.modules.filter(m => !m.isDeleted).length : 0;
                    csvContent += `"${c.title}","${c.status}","${c.trainerId ? c.trainerId.name : 'N/A'}","${activeModules}","${c.createdAt ? c.createdAt.toISOString() : ''}"\n`;
                });
                filename = 'courses_report.csv';
                break;
            }
            case 'enrollments': {
                const enrollments = await Enrollment.find()
                    .populate('learnerId', 'name email')
                    .populate('courseId', 'title')
                    .populate('enrolledBy', 'name');
                csvContent = 'Learner Name,Learner Email,Course,Progress (%),Status,Enrolled At,Completed At,Enrolled By\n';
                enrollments.forEach(e => {
                    csvContent += `"${e.learnerId ? e.learnerId.name : 'N/A'}","${e.learnerId ? e.learnerId.email : 'N/A'}","${e.courseId ? e.courseId.title : 'N/A'}","${e.progress ? e.progress.courseProgress : 0}","${e.status}","${e.enrolledAt ? e.enrolledAt.toISOString() : ''}","${e.completedAt ? e.completedAt.toISOString() : ''}","${e.enrolledBy ? e.enrolledBy.name : 'N/A'}"\n`;
                });
                filename = 'enrollments_report.csv';
                break;
            }
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid export type. Must be users, courses, or enrollments'
                });
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.status(200).send(csvContent);
    } catch (error) {
        next(error);
    }
};

// =============================================================================
// TRAINER APIs - Course-Level Analytics
// =============================================================================

/**
 * @desc    Get analytics summary for all courses owned by this trainer
 * @route   GET /api/reports/trainer/courses
 * @access  Private/Trainer
 */
exports.getTrainerCourses = async (req, res, next) => {
    try {
        const trainerId = req.user._id;

        // Get all courses by this trainer
        const courses = await Course.find({
            trainerId,
            isDeleted: false
        }).select('title status modules createdAt');

        // Get enrollment stats for each course
        const courseAnalytics = await Promise.all(
            courses.map(async (course) => {
                const enrollments = await Enrollment.find({ courseId: course._id });
                const totalEnrolled = enrollments.length;
                const completed = enrollments.filter(e => e.status === 'completed').length;
                const active = enrollments.filter(e => e.status === 'active').length;
                const dropped = enrollments.filter(e => e.status === 'dropped').length;

                const avgProgress = totalEnrolled > 0
                    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress ? e.progress.courseProgress : 0), 0) / totalEnrolled * 10) / 10
                    : 0;

                const completionRate = totalEnrolled > 0
                    ? Math.round((completed / totalEnrolled) * 100 * 10) / 10
                    : 0;

                const activeModules = course.modules ? course.modules.filter(m => !m.isDeleted).length : 0;
                let totalLessons = 0;
                if (course.modules) {
                    course.modules.forEach(m => {
                        if (!m.isDeleted) {
                            totalLessons += m.lessons ? m.lessons.filter(l => !l.isDeleted).length : 0;
                        }
                    });
                }

                return {
                    _id: course._id,
                    title: course.title,
                    status: course.status,
                    createdAt: course.createdAt,
                    modulesCount: activeModules,
                    lessonsCount: totalLessons,
                    totalEnrolled,
                    completed,
                    active,
                    dropped,
                    avgProgress,
                    completionRate
                };
            })
        );

        // Summary stats
        const totalCourses = courses.length;
        const totalEnrollments = courseAnalytics.reduce((sum, c) => sum + c.totalEnrolled, 0);
        const totalCompletions = courseAnalytics.reduce((sum, c) => sum + c.completed, 0);
        const overallAvgProgress = totalEnrollments > 0
            ? Math.round(courseAnalytics.reduce((sum, c) => sum + (c.avgProgress * c.totalEnrolled), 0) / totalEnrollments * 10) / 10
            : 0;

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalCourses,
                    totalEnrollments,
                    totalCompletions,
                    overallAvgProgress
                },
                courses: courseAnalytics
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get detailed analytics for a specific course
 * @route   GET /api/reports/trainer/courses/:courseId
 * @access  Private/Trainer
 */
exports.getCourseAnalytics = async (req, res, next) => {
    try {
        const trainerId = req.user._id;
        const { courseId } = req.params;

        // Verify course belongs to this trainer
        const course = await Course.findOne({
            _id: courseId,
            trainerId,
            isDeleted: false
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                error: 'Course not found or access denied'
            });
        }

        // Get all enrollments for this course
        const enrollments = await Enrollment.find({ courseId })
            .populate('learnerId', 'name email isActive');

        // Per-learner progress
        const learnerProgress = enrollments.map(enrollment => {
            const completedLessonsCount = enrollment.progress
                ? enrollment.progress.completedLessons.length
                : 0;
            const completedModulesCount = enrollment.progress
                ? enrollment.progress.completedModules.length
                : 0;

            return {
                enrollmentId: enrollment._id,
                learner: enrollment.learnerId,
                progress: enrollment.progress ? enrollment.progress.courseProgress : 0,
                completedLessons: completedLessonsCount,
                completedModules: completedModulesCount,
                status: enrollment.status,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt,
                lastAccessedAt: enrollment.progress ? enrollment.progress.lastAccessedAt : null
            };
        });

        // Module-level analysis
        const activeModules = course.modules ? course.modules.filter(m => !m.isDeleted) : [];
        const moduleAnalytics = activeModules.map(module => {
            const activeLessons = module.lessons ? module.lessons.filter(l => !l.isDeleted) : [];

            // Count how many learners completed each lesson
            const lessonStats = activeLessons.map(lesson => {
                const completedBy = enrollments.filter(e =>
                    e.progress && e.progress.completedLessons.some(
                        id => id.toString() === lesson._id.toString()
                    )
                ).length;

                return {
                    _id: lesson._id,
                    title: lesson.title,
                    contentType: lesson.contentType,
                    completedBy,
                    completionRate: enrollments.length > 0
                        ? Math.round((completedBy / enrollments.length) * 100)
                        : 0
                };
            });

            // Count how many learners completed this module
            const moduleCompletedBy = enrollments.filter(e =>
                e.progress && e.progress.completedModules.some(
                    id => id.toString() === module._id.toString()
                )
            ).length;

            return {
                _id: module._id,
                title: module.title,
                lessonsCount: activeLessons.length,
                completedBy: moduleCompletedBy,
                completionRate: enrollments.length > 0
                    ? Math.round((moduleCompletedBy / enrollments.length) * 100)
                    : 0,
                lessons: lessonStats
            };
        });

        // Summary
        const totalEnrolled = enrollments.length;
        const completed = enrollments.filter(e => e.status === 'completed').length;
        const avgProgress = totalEnrolled > 0
            ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress ? e.progress.courseProgress : 0), 0) / totalEnrolled * 10) / 10
            : 0;

        res.status(200).json({
            success: true,
            data: {
                course: {
                    _id: course._id,
                    title: course.title,
                    status: course.status,
                    createdAt: course.createdAt
                },
                summary: {
                    totalEnrolled,
                    completed,
                    active: enrollments.filter(e => e.status === 'active').length,
                    dropped: enrollments.filter(e => e.status === 'dropped').length,
                    avgProgress,
                    completionRate: totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0
                },
                learnerProgress,
                moduleAnalytics
            }
        });
    } catch (error) {
        next(error);
    }
};

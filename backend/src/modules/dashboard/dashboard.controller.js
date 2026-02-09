const User = require('../auth/user.model');
const Course = require('../courses/course.model');
// TODO: Uncomment when Enrollment module is created
// const Enrollment = require('../Enrollment/enrollment.model');
// Mock Enrollment model until the module is created
const Enrollment = {
    countDocuments: async () => 0,
    find: () => ({
        sort: () => ({
            limit: () => ({
                populate: () => ({
                    populate: () => Promise.resolve([])
                })
            })
        }),
        populate: () => Promise.resolve([])
    })
};
const ErrorResponse = require('../../utils/errorHandler');

/**
 * @desc    Get admin dashboard data
 * @route   GET /api/dashboard/admin
 * @access  Private/SuperAdmin/Admin
 */
exports.getAdminDashboard = async (req, res, next) => {
    try {
        // Get user counts by role
        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'Admin' });
        const trainerCount = await User.countDocuments({ role: 'Trainer' });
        const learnerCount = await User.countDocuments({ role: 'Learner' });

        // Get course stats
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ status: 'published' });
        const draftCourses = await Course.countDocuments({ status: 'draft' });

        // Get enrollment stats
        const totalEnrollments = await Enrollment.countDocuments();
        const completedEnrollments = await Enrollment.countDocuments({ status: 'completed' });
        const activeEnrollments = await Enrollment.countDocuments({ status: 'active' });

        // Get recent users
        const recentUsers = await User.find()
            .sort('-createdAt')
            .limit(5)
            .select('name email role createdAt');

        // Get recent courses
        const recentCourses = await Course.find()
            .sort('-createdAt')
            .limit(5)
            .select('title status createdAt');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    users: {
                        total: totalUsers,
                        admins: adminCount,
                        trainers: trainerCount,
                        learners: learnerCount,
                    },
                    courses: {
                        total: totalCourses,
                        published: publishedCourses,
                        draft: draftCourses,
                    },
                    enrollments: {
                        total: totalEnrollments,
                        completed: completedEnrollments,
                        active: activeEnrollments,
                    },
                },
                recentUsers,
                recentCourses,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get trainer dashboard data
 * @route   GET /api/dashboard/trainer
 * @access  Private/Trainer
 */
exports.getTrainerDashboard = async (req, res, next) => {
    try {
        const trainerId = req.user.id;

        // Get trainer's courses
        const myCourses = await Course.find({ instructor: trainerId });
        const totalCourses = myCourses.length;
        const publishedCourses = myCourses.filter(c => c.status === 'published').length;

        // Get course IDs for enrollment lookup
        const courseIds = myCourses.map(c => c._id);

        // Get enrollments for trainer's courses
        const totalEnrollments = await Enrollment.countDocuments({ course: { $in: courseIds } });
        const completedEnrollments = await Enrollment.countDocuments({
            course: { $in: courseIds },
            status: 'completed',
        });

        // Get recent enrollments in trainer's courses
        const recentEnrollments = await Enrollment.find({ course: { $in: courseIds } })
            .sort('-createdAt')
            .limit(5)
            .populate('user', 'name email')
            .populate('course', 'title');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    courses: {
                        total: totalCourses,
                        published: publishedCourses,
                    },
                    enrollments: {
                        total: totalEnrollments,
                        completed: completedEnrollments,
                    },
                },
                myCourses: myCourses.slice(0, 5),
                recentEnrollments,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get learner dashboard data
 * @route   GET /api/dashboard/learner
 * @access  Private/Learner
 */
exports.getLearnerDashboard = async (req, res, next) => {
    try {
        const learnerId = req.user.id;

        // Get learner's enrollments
        const myEnrollments = await Enrollment.find({ user: learnerId })
            .populate('course', 'title description thumbnail status');

        const totalEnrollments = myEnrollments.length;
        const completedCourses = myEnrollments.filter(e => e.status === 'completed').length;
        const inProgressCourses = myEnrollments.filter(e => e.status === 'active').length;

        // Calculate average progress
        const totalProgress = myEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
        const averageProgress = totalEnrollments > 0 ? Math.round(totalProgress / totalEnrollments) : 0;

        // Get recent activity (enrollments)
        const recentActivity = await Enrollment.find({ user: learnerId })
            .sort('-updatedAt')
            .limit(5)
            .populate('course', 'title thumbnail');

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    enrollments: totalEnrollments,
                    completed: completedCourses,
                    inProgress: inProgressCourses,
                    averageProgress,
                },
                myEnrollments,
                recentActivity,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get general dashboard stats based on user role
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userRole = req.user.role;
        let stats = {};

        switch (userRole) {
            case 'SuperAdmin':
            case 'Admin':
                stats = {
                    totalUsers: await User.countDocuments(),
                    totalCourses: await Course.countDocuments(),
                    totalEnrollments: await Enrollment.countDocuments(),
                    activeUsers: await User.countDocuments({ isActive: true }),
                };
                break;

            case 'Trainer':
                const trainerCourses = await Course.find({ instructor: req.user.id });
                const trainerCourseIds = trainerCourses.map(c => c._id);
                stats = {
                    myCourses: trainerCourses.length,
                    myStudents: await Enrollment.countDocuments({ course: { $in: trainerCourseIds } }),
                    publishedCourses: trainerCourses.filter(c => c.status === 'published').length,
                };
                break;

            case 'Learner':
                const learnerEnrollments = await Enrollment.find({ user: req.user.id });
                stats = {
                    enrolledCourses: learnerEnrollments.length,
                    completedCourses: learnerEnrollments.filter(e => e.status === 'completed').length,
                    inProgress: learnerEnrollments.filter(e => e.status === 'active').length,
                };
                break;

            default:
                stats = {};
        }

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

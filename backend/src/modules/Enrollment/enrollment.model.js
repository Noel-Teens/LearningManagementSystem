const mongoose = require('mongoose');

/**
 * Progress Schema (embedded in Enrollment)
 * Tracks learner's progress through a course
 */
const ProgressSchema = new mongoose.Schema({
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.modules.lessons'
    }],
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course.modules'
    }],
    courseProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    lastAccessedLessonId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    lastAccessedModuleId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    lastAccessedAt: {
        type: Date,
        default: null
    }
}, { _id: false });

/**
 * Enrollment Schema
 * Tracks learner enrollment in courses and their progress
 */
const EnrollmentSchema = new mongoose.Schema({
    learnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Learner ID is required']
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    enrolledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Enrolled by (Admin) is required']
    },
    progress: {
        type: ProgressSchema,
        default: () => ({
            completedLessons: [],
            completedModules: [],
            courseProgress: 0,
            lastAccessedLessonId: null,
            lastAccessedModuleId: null,
            lastAccessedAt: null
        })
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    completedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Compound index to prevent duplicate enrollments
EnrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true });

// Index for efficient querying
EnrollmentSchema.index({ learnerId: 1 });
EnrollmentSchema.index({ courseId: 1 });
EnrollmentSchema.index({ enrolledBy: 1 });

/**
 * Check if a lesson is completed
 */
EnrollmentSchema.methods.isLessonCompleted = function(lessonId) {
    return this.progress.completedLessons.some(
        id => id.toString() === lessonId.toString()
    );
};

/**
 * Check if a module is completed
 */
EnrollmentSchema.methods.isModuleCompleted = function(moduleId) {
    return this.progress.completedModules.some(
        id => id.toString() === moduleId.toString()
    );
};

/**
 * Calculate and update progress percentages
 * @param {Object} course - The course document with modules and lessons
 */
EnrollmentSchema.methods.calculateProgress = function(course) {
    if (!course || !course.modules) return 0;

    // Get all active (non-deleted) lessons from all active modules
    const allLessons = [];
    const allModules = [];

    course.modules.forEach(module => {
        if (!module.isDeleted) {
            allModules.push(module._id);
            module.lessons.forEach(lesson => {
                if (!lesson.isDeleted) {
                    allLessons.push(lesson._id);
                }
            });
        }
    });

    const totalLessons = allLessons.length;
    if (totalLessons === 0) {
        this.progress.courseProgress = 0;
        return 0;
    }

    // Count completed lessons
    const completedCount = this.progress.completedLessons.filter(lessonId =>
        allLessons.some(id => id.toString() === lessonId.toString())
    ).length;

    // Calculate percentage
    const progress = Math.round((completedCount / totalLessons) * 100);
    this.progress.courseProgress = progress;

    // Check module completions
    course.modules.forEach(module => {
        if (!module.isDeleted) {
            const moduleLessons = module.lessons.filter(l => !l.isDeleted);
            const moduleCompleted = moduleLessons.every(lesson =>
                this.progress.completedLessons.some(
                    id => id.toString() === lesson._id.toString()
                )
            );

            if (moduleCompleted && moduleLessons.length > 0) {
                if (!this.isModuleCompleted(module._id)) {
                    this.progress.completedModules.push(module._id);
                }
            }
        }
    });

    // Check if course is completed
    if (progress === 100) {
        this.status = 'completed';
        this.completedAt = new Date();
    }

    return progress;
};

module.exports = mongoose.model('Enrollment', EnrollmentSchema);

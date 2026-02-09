const mongoose = require('mongoose');

/**
 * Lesson Schema (embedded in Module)
 * Supports PDF, Video, and Link content types.
 */
const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Lesson title is required'],
        trim: true,
        maxlength: [200, 'Lesson title cannot be more than 200 characters'],
    },
    contentType: {
        type: String,
        required: [true, 'Content type is required'],
        enum: {
            values: ['PDF', 'Video', 'Link'],
            message: 'Content type must be PDF, Video, or Link',
        },
    },
    contentUrl: {
        type: String,
        required: [true, 'Content URL is required'],
        trim: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { _id: true, timestamps: true });

/**
 * Module Schema (embedded in Course)
 * A module contains an ordered list of lessons.
 */
const ModuleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Module title is required'],
        trim: true,
        maxlength: [200, 'Module title cannot be more than 200 characters'],
    },
    order: {
        type: Number,
        default: 0,
    },
    lessons: [LessonSchema],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, { _id: true, timestamps: true });

/**
 * Course Schema
 * Main document for course management.
 * `_id` serves as the stable courseId for all future modules.
 */
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [300, 'Course title cannot be more than 300 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [5000, 'Course description cannot be more than 5000 characters'],
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Trainer ID is required'],
    },
    status: {
        type: String,
        enum: {
            values: ['Draft', 'Published'],
            message: 'Status must be Draft or Published',
        },
        default: 'Draft',
    },
    modules: [ModuleSchema],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Index for efficient querying of active courses by trainer
CourseSchema.index({ trainerId: 1, isDeleted: 1 });
CourseSchema.index({ status: 1, isDeleted: 1 });

module.exports = mongoose.model('Course', CourseSchema);

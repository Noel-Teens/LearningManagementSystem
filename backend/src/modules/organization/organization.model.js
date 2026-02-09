const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add organization name'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    logoUrl: {
      type: String,
      default: '',
    },
    theme: {
      mode: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      fontFamily: {
        type: String,
        default: 'Inter, sans-serif',
      },
    },
    learningPolicies: {
      allowSelfEnrollment: {
        type: Boolean,
        default: false,
      },
      certificateAutoGeneration: {
        type: Boolean,
        default: true,
      },
      passingScorePercentage: {
        type: Number,
        default: 70,
        min: 0,
        max: 100,
      },
      maxQuizAttempts: {
        type: Number,
        default: 3,
      },
    },
    contactEmail: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    website: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organization', organizationSchema);

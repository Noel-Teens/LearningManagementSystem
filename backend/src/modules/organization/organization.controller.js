const Organization = require('./organization.model');
const ErrorResponse = require('../../utils/errorHandler');

/**
 * @desc    Create organization
 * @route   POST /api/organizations
 * @access  Private/SuperAdmin
 */
exports.createOrganization = async (req, res, next) => {
    try {
        const organization = await Organization.create(req.body);

        res.status(201).json({
            success: true,
            data: organization,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all organizations
 * @route   GET /api/organizations
 * @access  Private/Admin
 */
exports.getOrganizations = async (req, res, next) => {
    try {
        const organizations = await Organization.find();

        res.status(200).json({
            success: true,
            count: organizations.length,
            data: organizations,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single organization
 * @route   GET /api/organizations/:id
 * @access  Private
 */
exports.getOrganization = async (req, res, next) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            return next(new ErrorResponse('Organization not found', 404));
        }

        res.status(200).json({
            success: true,
            data: organization,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update organization
 * @route   PUT /api/organizations/:id
 * @access  Private/SuperAdmin/Admin
 */
exports.updateOrganization = async (req, res, next) => {
    try {
        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!organization) {
            return next(new ErrorResponse('Organization not found', 404));
        }

        res.status(200).json({
            success: true,
            data: organization,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete organization
 * @route   DELETE /api/organizations/:id
 * @access  Private/SuperAdmin
 */
exports.deleteOrganization = async (req, res, next) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            return next(new ErrorResponse('Organization not found', 404));
        }

        await organization.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update organization theme
 * @route   PUT /api/organizations/:id/theme
 * @access  Private/SuperAdmin/Admin
 */
exports.updateTheme = async (req, res, next) => {
    try {
        const { primaryColor, secondaryColor, fontFamily } = req.body;

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            {
                theme: {
                    primaryColor,
                    secondaryColor,
                    fontFamily,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!organization) {
            return next(new ErrorResponse('Organization not found', 404));
        }

        res.status(200).json({
            success: true,
            data: organization,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update learning policies
 * @route   PUT /api/organizations/:id/policies
 * @access  Private/SuperAdmin/Admin
 */
exports.updateLearningPolicies = async (req, res, next) => {
    try {
        const {
            allowSelfEnrollment,
            certificateAutoGeneration,
            passingScorePercentage,
            maxQuizAttempts
        } = req.body;

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            {
                learningPolicies: {
                    allowSelfEnrollment,
                    certificateAutoGeneration,
                    passingScorePercentage,
                    maxQuizAttempts,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!organization) {
            return next(new ErrorResponse('Organization not found', 404));
        }

        res.status(200).json({
            success: true,
            data: organization,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload organization logo
 * @route   PUT /api/organizations/:id/logo
 * @access  Private/SuperAdmin/Admin
 */
exports.uploadLogo = async (req, res, next) => {
    try {
        const { logoUrl } = req.body;

        if (!logoUrl) {
            return next(new ErrorResponse('Please provide a logo URL', 400));
        }

        const organization = await Organization.findByIdAndUpdate(
            req.params.id,
            { logoUrl },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!organization) {
            return next(new ErrorResponse('Organization not found', 404));
        }

        res.status(200).json({
            success: true,
            data: organization,
        });
    } catch (error) {
        next(error);
    }
};

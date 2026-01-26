const cloudinary = require('../../config/cloudinary');
const ErrorResponse = require('../../utils/errorHandler');

/**
 * @desc    Upload image to Cloudinary
 * @route   POST /api/upload/image
 * @access  Private/Admin
 */
exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload an image file', 400));
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'lms',
            resource_type: 'image',
            transformation: [
                { width: 500, height: 500, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        });

        res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        next(new ErrorResponse('Image upload failed', 500));
    }
};

/**
 * @desc    Upload organization logo
 * @route   POST /api/upload/logo
 * @access  Private/Admin
 */
exports.uploadLogo = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new ErrorResponse('Please upload a logo image', 400));
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary with logo-specific settings
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'lms/logos',
            resource_type: 'image',
            transformation: [
                { width: 300, height: 300, crop: 'limit' },
                { quality: 'auto:best' },
                { fetch_format: 'auto' },
            ],
        });

        res.status(200).json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
            },
        });
    } catch (error) {
        console.error('Cloudinary logo upload error:', error);
        next(new ErrorResponse('Logo upload failed', 500));
    }
};

/**
 * @desc    Delete image from Cloudinary
 * @route   DELETE /api/upload/image/:publicId
 * @access  Private/Admin
 */
exports.deleteImage = async (req, res, next) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return next(new ErrorResponse('Please provide image public ID', 400));
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === 'ok') {
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
            });
        } else {
            next(new ErrorResponse('Image deletion failed', 400));
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        next(new ErrorResponse('Image deletion failed', 500));
    }
};

const express = require('express');
const { uploadImage, uploadLogo, deleteImage } = require('./upload.controller');
const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');
const upload = require('../../middlewares/upload.middleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('SuperAdmin', 'Admin'));

router.post('/image', upload.single('image'), uploadImage);
router.post('/logo', upload.single('logo'), uploadLogo);
router.delete('/image/:publicId', deleteImage);

module.exports = router;

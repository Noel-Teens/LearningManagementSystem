const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  getUsers,
  updatePassword,
  updateUserStatus,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require('./auth.controller');

const router = express.Router();

const { protect } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/role.middleware');

router.post('/register', protect, authorize('SuperAdmin', 'Admin'), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.get('/users', protect, authorize('SuperAdmin', 'Admin'), getUsers);
router.put('/users/:id/status', protect, authorize('SuperAdmin', 'Admin'), updateUserStatus);
router.delete('/users/:id', protect, authorize('SuperAdmin'), deleteUser);

module.exports = router;

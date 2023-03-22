const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');
const adminAuthorization = require('../middlewares/adminAuthorization');

router.get('/admin/users', adminAuthorization, userController.getAllUsers);
router.get('/logout', userController.logout);
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/forget-password', userController.forgetPasswordEmail);
router.get('/setting/:email', verifyToken, userController.userDetails);
router.post('/user/set-new-password/:ptoken', userController.setNewPassword);
router.get('/signup/confirmation/:token', userController.confirmEmail);
router.get(
  '/admin/:email',
  verifyToken,
  adminAuthorization,
  userController.getAdmin
);
router.delete(
  '/user/admin/delete/:email',
  adminAuthorization,
  userController.deleteUser
);
router.patch(
  '/update-profile/:email',
  verifyToken,
  userController.updateProfile
);
router.patch('/add-review', verifyToken, userController.addReview);

module.exports = router;

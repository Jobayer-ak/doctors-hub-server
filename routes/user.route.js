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
router.post('/add-review', verifyToken, userController.addReview);
router.get('/get-reviews', userController.getReviews);
router.post('/user/set-new-password/:ptoken', userController.setNewPassword);
router.get('/signup/confirmation/:token', userController.confirmEmail);
router.get('/setting/:email', verifyToken, userController.userDetails);
router.get(
  '/admin/:email',
  verifyToken,
  adminAuthorization,
  userController.getAdmin
);
router.get('/all-payments', adminAuthorization, userController.getAllPayments);
router.delete(
  '/user/admin/delete/:email',
  adminAuthorization,
  userController.deleteUser
);
router.patch(
  '/admin/make-admin/:id',
  adminAuthorization,
  userController.makeAdmin
);
router.patch(
  '/update-profile/:email',
  verifyToken,
  userController.updateProfile
);

module.exports = router;

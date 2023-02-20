const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const adminAuthorization = require("../middlewares/adminAuthorization");

router.get("/admin/users", adminAuthorization, userController.getAllUsers);
router.get("/logout", userController.logout);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.patch("/update-profile/:email", verifyToken, userController.updateProfile);
router.post("/forget-password", userController.forgetPasswordEmail);
router.get("/setting/:email", userController.userDetails);
router.post("/user/set-new-password/:ptoken", userController.setNewPassword);
router.get("/signup/confirmation/:token", userController.confirmEmail);
router.get(
  "/admin/:email",
  verifyToken,
  adminAuthorization,
  userController.getAdmin
);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");
const adminAuthorization = require("../middlewares/adminAuthorization");


router.get(
  "/admin/:email",
  verifyToken,
  adminAuthorization,
  userController.getAdmin
);
router.get("/admin/users", adminAuthorization, userController.getAllUsers);
router.get("/logout", userController.logout);
router.post("/signup", userController.signup);
router.post("/login", userController.login);


module.exports = router;

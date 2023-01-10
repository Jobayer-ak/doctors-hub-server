const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/logout", verifyToken, userController.logout);
router.post("/signup", userController.signup);
router.post("/login", userController.login);


module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const session = require("express-session");
router.use(session({ secret: process.env.SESSION_SECRET }));

router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;

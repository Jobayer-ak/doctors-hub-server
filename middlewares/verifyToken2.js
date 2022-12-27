const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user.model");
const { loginService } = require("../services/user.service");

module.exports = async (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1];
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        status: "Failed",
        error: "You are not logged in!",
      });
    }

    const decodedData = await promisify(jwt.verify)(
      token,
      process.env.TOKEN_SECRET
    );

    const user = await loginService(decodedData.email);

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      status: "Failed",
      error: "Invalid Token",
    });
  }
};

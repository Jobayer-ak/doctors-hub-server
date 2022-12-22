const bcrypt = require("bcrypt");
// const { response } = require("express");
const jwt = require("jsonwebtoken");

const {
  signUpService,
  findByEmailService,
} = require("../services/user.service");
const { generateToken } = require("../utils/token");
const User = require("../models/user.model");

// signup
exports.signup = async (req, res) => {
  try {
    const user = await signUpService(req.body);

    res.status(200).json({
      status: "Success",
      message: "Successfully Signed Up!",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// login with passport local strategy
// exports.login = async (req, res, next) => {
//   await passport.authenticate("local", (err, user, message) => {
//     // console.log(user, message);

//     if (err) {
//       return res.status(400).json({ error: errors.message });
//     }
//     if (!user) {
//       return res.status(401).json({ error: message });
//     }

//     // req.login(user, function(err) {
//     //   if (err) { return next(err); }
//     //   return res.status(200).json({user});
//     // });

//     res.status(200).json({
//       status: "Success",
//       user,
//     });
//   })(req, res, next);
// };

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cookies = req.cookies;

    // check email and password are provided
    if (!email || !password) {
      return res.status(401).json({
        status: "Failed",
        error: "Please provide your username and password!",
      });
    }

    // load user with email
    const user = await findByEmailService(email);

    if (!user) {
      console.log("user");
      return res.status(401).json({
        // 401 unauthorized
        status: "Failed",
        error: "No user found! please create an account!",
      });
    }

    //is password valid?
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === false) {
        return res.status(401).json({
          status: "Failed",
          message: "Password is not correct!",
        });
      }
    });

    // generate token
    const token = generateToken(user);

    // generate refresh token
    const payload = {
      email: user.email,
      role: user.role,
    };

    const newRefreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? user.refreshToken
      : user.refreshToken.filter((rt) => rt !== cookies.jwt);

    // console.log(newRefreshTokenArray);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      console.log("found");
      // detected refresh token reuse
      if (!foundToken) {
        console.log("attemted refresh token reuse at login!");
        // clear out all previous refresh tokens
        newRefreshTokenArray = [];
      }

      // set cookies
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }

    // saving refreshToken with current user
    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    // const result = await user.save();
    const { password: pwd, ...others } = user.toObject();
    console.log(others);

    // create secure cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Successfully loggedin",
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

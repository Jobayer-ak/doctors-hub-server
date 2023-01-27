const bcrypt = require("bcrypt");
// const { response } = require("express");
const jwt = require("jsonwebtoken");
const {
  signUpService,
  findByEmailService,
} = require("../services/user.service");
const { generateToken } = require("../utils/token");
const User = require("../models/user.model");
const Doctor = require("../models/addDoctor.model");

exports.getAllUsers = async (req, res) => {
  try {
    console.log(req.user);
    const users = await User.find();
    // console.log(users);
    res.send(users);
  } catch (error) {
    res.send(error);
  }
};

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

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      return res.status(401).json({
        // 401 unauthorized
        status: "Failed",
        error: "No user found! please create an account!",
      });
    }

    // verify password
    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch) {
      return res.status(400).json({
        status: "Failed",
        message: "Username or Password is wrong",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        success: true,
        message: "successfully loggedin",
        token,
        others,
      });

    // const options = {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "None",
    //   maxAge: 50000,
    //   path: "/",
    // };

    // res.cookie("access_token", token, options).json({
    //   status: true,
    //   message: "Successfully loggedin!",
    //   others,
    //   token,
    // });

    // console.log(req.cookies);

    // res.cookie("jwt", newRefreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "None",
    //     maxAge: 24 * 60 * 60 * 1000,
    //   });

    // if (match) {
    //   console.log("matched: " + match);
    //   const roles = user.role;

    //   // const token = generateToken(user);

    //   const accessToken = jwt.sign(
    //     {
    //       UserInfo: {
    //         username: user.email,
    //         roles: roles,
    //       },
    //     },
    //     process.env.TOKEN_SECRET,
    //     { expiresIn: "10s" }
    //   );

    //   // create refresh token
    //   const newRefreshToken = jwt.sign(
    //     { email: user.email },
    //     process.env.REFRESH_TOKEN_SECRET,
    //     { expiresIn: "1d" }
    //   );

    //   // change to let keyword
    //   let newRefreshTokenArray = !cookies?.jwt
    //     ? user.refreshToken
    //     : user.refreshToken.filter((rt) => rt !== cookies.jwt);

    //   if (cookies?.jwt) {
    //     const refreshToken = cookies.jwt;
    //     const foundToken = await User.findOne({ refreshToken }).exec();

    //     // detected refresh token reuse
    //     if (!foundToken) {
    //       console.log("attemted refresh token reuse at login");
    //       // clear out all previous refresh tokens
    //       newRefreshTokenArray = [];
    //     }

    //     res.clearCookie("jwt", {
    //       httpOnly: true,
    //       sameSite: "None",
    //       secure: true,
    //     });
    //   }

    //   // Saving refreshToken with current user
    //   user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    //   const result = await user.save();
    //   // const query = { email: user.email };
    //   // const result = await User.findOneAndUpdate(query, {
    //   //   refreshToken: [...newRefreshTokenArray, newRefreshToken],
    //   // });

    //   console.log(result);
    //   console.log(roles);

    //   // Creates Secure Cookie with refresh token
    //   res.cookie("jwt", newRefreshToken, {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "None",
    //     maxAge: 24 * 60 * 60 * 1000,
    //   });

    //   // Send authorization roles and access token to user
    //   res.json({ roles, accessToken });
    // }

    //is password valid?
    // bcrypt.compare(password, user.password, function (err, result) {
    //   if (result === false) {
    //     return res.status(401).json({
    //       status: "Failed",
    //       message: "Password is not correct!",
    //     });
    //   }
    // });

    // evaluate password
    // generate token

    // const token = generateToken(user);

    // res.cookie("token", token, { httpOnly: true });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({ message: "cookie is cleared!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// add doctor by admin
exports.addDoctor = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;

    const exist = await Doctor.find({ email });

    if (exist.length !== 0) {
      console.log("Hello", exist);

      return res.send({
        status: 403,
        message: "This doctor is already added.",
      });
    }

    const doctors = await Doctor.create(req.body);
    console.log("response: ", doctors);

    res.send(doctors);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error,
    });
  }
};

// get all doctors
exports.getAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find({});

    res.status(200).send(doctors);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// get admin
exports.getAdmin = async (req, res) => {
  try {
    const email = req.params;

    const result = await User.findOne(email)

    res.send(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

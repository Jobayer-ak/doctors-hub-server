const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  signUpService,
  findByEmailService,
} = require("../services/user.service");
const { generateToken } = require("../utils/token");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const { sendMail } = require("../utils/email");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // console.log(users);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await signUpService(req.body);

    const token = user.generateConfirmationToken();

    await user.save({ validateBeforeSave: false });

    const url = req.protocol + "://" + req.get("host") + req.originalUrl;

    // email html template
    const mailInfo = {
      email: email,
      subject: "Verify Your Account",
      html: `
      <div style="padding:10px; text-align: center;">
      <h2>Hello ${name}</h2>
      <p>Thank you for creating your account. Please confirm your account.</p>
      <a href="${url}/confirmation/${token}" style="text-decoration:none;"> <button type="submit" style="color:white;text-align:center; background:blue; padding:5px 4px">Please Confirm Your Email</button></a>
     

      
      </div>
    `,
    };

    // send email to user
    sendMail(mailInfo);

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

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: "Fail",
        error: "Invalid Token",
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: "Failed",
        error: "User Confirmation Token Expired",
      });
    }
    user.status = "active";
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "Success",
      message: "Successfully activated your account",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      error,
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
    const isPassMatch = user.comparePassword(password, user.password);

    if (!isPassMatch) {
      return res.status(400).json({
        status: "Failed",
        message: "Username or Password is wrong",
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    res
      .cookie("myCookie", token, {
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
    await res.clearCookie("myCookie");
    // console.log("cook ",result)
    res.send({ message: "cookie is cleared!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get admin
exports.getAdmin = async (req, res) => {
  try {
    const email = req.params;

    const result = await User.findOne(email);
    // console.log(result);
    res.send(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

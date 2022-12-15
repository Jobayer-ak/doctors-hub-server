const bcrypt = require("bcrypt");
const { response } = require("express");
const passport = require("passport");

const {
  signUpService,
  findByEmailService,
} = require("../services/user.service");
const { generateToken } = require("../utils/token");

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

// const pss = require("../auth/passportConfig");

// login with passport local strategy
exports.login = async (req, res, next) => {
  await passport.authenticate("local", (err, user, message) => {
    // console.log(user, message);

    if (err) {
      return res.status(400).json({ error: errors.message });
    }
    if (!user) {
      return res.status(403).json({ error: message });
    }

    res.status(200).json({
      status: "Success",
      user,
    });
  })(req, res, next);
};

// login
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // check email and password are provided
//     if (!email || !password) {
//       return res.status(401).json({
//         status: "Failed",
//         error: "Please provide your username and password!",
//       });
//     }

//     // load user with email
//     // const user = await findByEmailService(email);

//     if (!user) {
//       return res.status(401).json({
//         status: "Failed",
//         error: "No user found! please create an account!",
//       });
//     }

//     //is password valid?
//     bcrypt.compare(password, user.password, function (err, result) {
//       if (result === false) {
//         return res.status(401).json({
//           status: "Failed",
//           message: "Password is not correct!",
//         });
//       }
//     });

//     // generate token
//     const token = generateToken(user);

//     const { password: pwd, ...others } = user.toObject();

//     res.status(200).json({
//       status: "success",
//       message: "Successfully loggedin",
//       data: {
//         user: others,
//         token,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "Failed",
//       message: error.message,
//     });
//   }
// };

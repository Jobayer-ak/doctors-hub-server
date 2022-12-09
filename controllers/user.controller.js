const bcrypt = require("bcrypt");

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

    const { password: pwd, ...others } = user.toObject();

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

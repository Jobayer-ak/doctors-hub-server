const { signUpService } = require("../services/user.service");

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

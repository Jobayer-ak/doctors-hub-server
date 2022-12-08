const User = require("../models/user.model");

exports.signUpService = async (userInfo) => {
  const user = await User.create(userInfo);
  return user;
};

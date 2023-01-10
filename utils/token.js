const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  // json accepts 3 parameters  1-> payload(body) 2-> secret and 3->option
  const payload = {
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

// exports.generateToken = (user) => {
//   // json accepts 3 parameters  1-> payload(body) 2-> secret and 3->option
//   const payload = {
//     email: user.email,
//     role: user.role,
//   };

//   const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
//     expiresIn: "10s",
//   });

//   return token;
// };

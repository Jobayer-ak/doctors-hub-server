const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      console.log("token error: ", err);
      return res.status(401).send({ message: "UnAuthorized access" });
    }
    req.user = decoded;

    next();
  });
};

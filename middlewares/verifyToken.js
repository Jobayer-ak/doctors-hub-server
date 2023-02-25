const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.myCookie;

  if (!token) {
    console.log("401 Authentication invalid")
    return res.status(401).json({ message: "Authentication invalid" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "UnAuthorized access" });
    }
    req.user = decoded;
    // console.log("User: ", req.user);
    next();
  });
};

module.exports = verifyToken;

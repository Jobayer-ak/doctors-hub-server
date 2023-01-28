const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.myCookie;

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "UnAuthorized access" });
    }
    req.user = decoded;
    

    next();
  });
};

module.exports = verifyToken;

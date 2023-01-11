const jwt = require("jsonwebtoken");

const adminAuthorization = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "UnAuthorized Access!" });
    }
   
    if (decoded.role !== "admin") {
      console.log("role");
      return res.status(401).send({ message: "You are not admin!" });
    }

    req.user = decoded;
    console.log(1, req.user);

    next();
  });
};

module.exports = adminAuthorization;

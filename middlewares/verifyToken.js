const { default: jwtDecode } = require("jwt-decode");

module.exports = (req, res, next) => {
  // const token = req.headers.authorization;
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication invalid" });
  }
  // const decodedToken = jwtDecode(token.slice(7));
  const decodedToken = jwtDecode(token);

  if (!decodedToken) {
    return res.status(401).json({
      message: "There was a problem authorizing the request",
    });
  } else {
    req.user = decodedToken;
    next();
  }
};

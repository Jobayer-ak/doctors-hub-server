const jwt = require('jsonwebtoken');

const adminAuthorization = (req, res, next) => {
  const token = req.cookies.myCookie;

  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid' });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: 'UnAuthorized Access!' });
    }

    if (decoded.role !== 'admin') {
      return res.status(401).send({ message: 'You are not admin!' });
    }

    req.user = decoded;

    next();
  });
};

module.exports = adminAuthorization;

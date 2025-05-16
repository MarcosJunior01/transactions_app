const jwt = require("jsonwebtoken");
const config = require("../config/config.js");

verifyToken = (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
    return;
  }

  res.status(403).send({ message: "Require Admin Role!" });
};

const authJwt = {
  verifyToken,
  isAdmin
};

module.exports = authJwt;
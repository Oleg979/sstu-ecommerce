var jwt = require("jsonwebtoken");
var config = require("../config/jwt.config");
var User = require("../models/user.model");

const verifyToken = (req, res, next) => {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "Нет токена." });
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Токен не действителен." });
    req.userId = decoded.id;
    User.findOne({ _id: decoded.id }, (err, user) => {
      if (!user.isAdmin)
        return res
          .status(403)
          .send({ auth: false, message: "Нет прав для данного действия." });
      next();
    });
  });
};
module.exports = verifyToken;

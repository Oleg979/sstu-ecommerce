var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var config = require("../config/jwt.config");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var VerifyToken = require("../services/tokenVerification.service");
var User = require("../models/user.model");
var sendMail = require("../services/mail.service");
var verifyAdmin = require("../services/adminVerification.service");

router.get("/", verifyAdmin, (req, res) => {
  User.find({}, (err, users) => {
    if (err || !users)
      return res.status(501).send({
        res: false,
        text: "Ошибка сервера!"
      });
    res.status(200).send({ res: true, users });
  });
});

router.get("/grantadmin/:id", verifyAdmin, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err)
      return res.status(501).send({
        res: false,
        text: "Ошибка сервера!"
      });
    user.isAdmin = !user.isAdmin;
    user.save();
    res.status(200).send({ res: true });
  });
});

router.delete("/:id", verifyAdmin, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err)
      return res.status(501).send({
        res: false,
        text: "Ошибка сервера!"
      });
    user.remove();
    res.status(200).send({ res: true });
  });
});

module.exports = router;

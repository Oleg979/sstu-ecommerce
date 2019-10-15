var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyAdmin = require("../services/adminVerificationService");
var verifyToken = require("../services/tokenVerificationService");

var Item = require("../models/Item");
var Comment = require("../models/Comment");
var User = require("../models/User");

router.post("/", verifyToken, (req, res) => {
  User.findById(req.userId, { password: 0 }, (err, user) => {
    Comment.create(
      {
        itemId: req.body.itemId,
        text: req.body.text,
        userName: user.name,
        creationDate: req.body.creationDate
      },
      (err, comment) => {
        if (err) return res.status(500).send("Произошла ошибка на сервере.");
        res.status(200).send(comment);
      }
    );
  });
});

router.get("/:id", (req, res) => {
  Comment.find({ itemId: req.params.id }, (err, comments) => {
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    res.status(200).send(comments);
  });
});

router.get("/", (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    res.status(200).send(comments);
  });
});

module.exports = router;

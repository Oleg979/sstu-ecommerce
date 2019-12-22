var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyAdmin = require("../services/adminVerification.service");
var verifyToken = require("../services/tokenVerification.service");
var getSentiment = require("../services/sentimentAnalysis.service");

var Item = require("../models/item.model");
var Comment = require("../models/comment.model");
var User = require("../models/user.model");

router.post("/", verifyToken, async (req, res) => {
  User.findById(req.userId, { password: 0 }, async (err, user) => {
    const sentiment = await getSentiment(req.body.text);
    Comment.create(
      {
        itemId: req.body.itemId,
        text: req.body.text,
        userName: user.name,
        creationDate: req.body.creationDate,
        sentiment
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

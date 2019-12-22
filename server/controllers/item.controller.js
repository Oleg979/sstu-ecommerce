//////////////////////////////////////////////////////////////////////////////////////

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.json({ limit: "10mb", extended: true }));
router.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

var verifyAdmin = require("../services/adminVerification.service");
var verifyToken = require("../services/tokenVerification.service");
var Item = require("../models/item.model");
var Rate = require("../models/rate.model");
var upload = require("../config/storage.config");
//////////////////////////////////////////////////////////////////////////////////////

router.delete("/:id", verifyAdmin, (req, res) => {
  Item.findByIdAndRemove(req.params.id, (err, item) => {
    if (err)
      return res
        .status(500)
        .send({ res: false, text: "Произошла ошибка на сервере." });
    res
      .status(200)
      .send({ res: true, text: "Товар: " + item.title + " удалён." });
  });
});

router.post("/", verifyAdmin, (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.status(500).send({ res: false, text: err });
    }
    Item.create(
      {
        title: req.body.title,
        image: req.file.filename,
        price: req.body.price,
        desc: req.body.description,
        type: req.body.type
      },
      (err, item) => {
        if (err)
          return res
            .status(500)
            .send({ res: false, text: "Произошла ошибка на сервере." });
        res.status(200).send({ res: true, item });
      }
    );
  });
});

router.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    res.status(200).send(items);
  });
});

router.get("/:id", (req, res) => {
  Item.findById(req.params.id, (err, item) => {
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    if (!user)
      return res.status(404).send(`Товар с id ${req.params.id} не найден.`);
    res.status(200).send(item);
  });
});

router.get("/isRated/:id", verifyToken, (req, res) => {
  Rate.findOne({ userId: req.userId, itemId: req.params.id }, (err, rate) => {
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    if (!rate) return res.status(404).send({ res: false });
    res.status(200).send({ res: true, rate: rate.rate });
  });
});

router.post("/rate/:id", verifyToken, (req, res) => {
  Rate.create(
    {
      userId: req.userId,
      itemId: req.params.id,
      rate: req.body.amount
    },
    (err, rate) => {
      Item.findById(req.params.id, (err, item) => {
        var numOfVoters = Number(item.numOfVoters);
        var rate = Number(item.rate);
        var amount = Number(req.body.amount);
        rate = (rate * numOfVoters + Number(amount)) / (numOfVoters + 1);
        item.rate = rate;
        item.numOfVoters = item.numOfVoters + 1;
        item.save();
        res.status(200).send({ success: true });
      });
    }
  );
});

module.exports = router;

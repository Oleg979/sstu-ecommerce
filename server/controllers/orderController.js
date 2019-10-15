var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var verifyAdmin = require("../services/adminVerificationService");
var verifyToken = require("../services/tokenVerificationService");
var User = require("../models/User");
var Order = require("../models/Order");

router.post("/", verifyToken, (req, res) => {
  Order.create(
    {
      customerId: req.userId,
      payload: req.body.payload,
      sum: req.body.sum,
      creationDate: req.body.creationDate
    },
    (err, order) => {
      if (err) return res.status(500).send("Произошла ошибка на сервере.");
      User.findById(req.userId, (err2, user) => {
        if (err2) return res.status(500).send("Произошла ошибка на сервере.");
        user.numOfOrders++;
        user.save();
        res.status(200).send(order);
      });
    }
  );
});

router.get(":id/accept", verifyAdmin, (req, res) => {
  Order.findById(req.params.id, (err, order) => {
    order.status = "Accepted";
    order.save();
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    res.status(200).send(order);
  });
});

router.get("/", verifyToken, (req, res) => {
  Order.find({ customerId: req.userId }, (err, orders) => {
    if (err) return res.status(500).send("Произошла ошибка на сервере.");
    res.status(200).send({ orders });
  });
});

module.exports = router;

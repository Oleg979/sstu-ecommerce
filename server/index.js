//////////////////////////////////////////////////////////////////////////////////
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(express.static('uploads'));

require("./config/db.config");

app.get("/", (req, res) => res.send("Working..."));

var authController = require("./controllers/auth.controller");
app.use("/auth", authController);

var itemController = require("./controllers/item.controller");
app.use("/item", itemController);

var commentController = require("./controllers/comments.controller");
app.use("/comment", commentController);

var orderController = require("./controllers/order.controller");
app.use("/order", orderController);

var userController = require("./controllers/user.controller");
app.use("/user", userController);

var port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Express server listening on port ${port}`));
//////////////////////////////////////////////////////////////////////////////////

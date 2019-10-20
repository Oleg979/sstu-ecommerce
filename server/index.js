//////////////////////////////////////////////////////////////////////////////////
var express = require("express");
var app = express();
var cors = require("cors");
app.use(cors());

require("./config/dbConfig");

app.get("/", (req, res) => res.send("Working..."));

var authController = require("./controllers/authController");
app.use("/auth", authController);

var itemController = require("./controllers/itemController");
app.use("/item", itemController);

var commentController = require("./controllers/commentsController");
app.use("/comment", commentController);

var orderController = require("./controllers/orderController");
app.use("/order", orderController);

var userController = require("./controllers/userController");
app.use("/user", userController);

var port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Express server listening on port ${port}`));
//////////////////////////////////////////////////////////////////////////////////

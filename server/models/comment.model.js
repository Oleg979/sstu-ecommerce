var mongoose = require("mongoose");
var CommentSchema = new mongoose.Schema({
  itemId: String,
  text: String,
  userName: String,
  creationDate: String,
  sentiment: String
});
mongoose.model("Comment", CommentSchema);

module.exports = mongoose.model("Comment");

var mongoose = require("mongoose");

var OrderSchema = new mongoose.Schema({
  customerId: String,
  payload: [
    {
      itemId: String,
      amount: Number
    }
  ],
  sum: Number,
  status: {
    type: String,
    default: "New"
  },
  creationDate: String
});
mongoose.model("Order", OrderSchema);

module.exports = mongoose.model("Order");

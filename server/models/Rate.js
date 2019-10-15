var mongoose = require("mongoose");
var RateSchema = new mongoose.Schema({
    itemId: String,
    userId: String,
    rate: Number
});
mongoose.model("Rate", RateSchema);

module.exports = mongoose.model("Rate");
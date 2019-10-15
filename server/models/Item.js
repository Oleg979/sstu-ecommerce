var mongoose = require("mongoose");
var ItemSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    desc: String,
    type: String,
    rate: {
        type: Number,
        default: 0
    },
    numOfBuyers: {
        type: Number,
        default: 0
    },
    numOfVoters: {
        type: Number,
        default: 0
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
});
mongoose.model("Item", ItemSchema);

module.exports = mongoose.model("Item");
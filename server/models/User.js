var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    verificationCode: String,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    numOfOrders: {
        type: Number,
        default: 0
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
});
mongoose.model("User", UserSchema);

module.exports = mongoose.model("User");
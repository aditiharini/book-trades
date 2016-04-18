var mongoose = require("mongoose");
var Book = require("./bookModel.js")
var User = require("./userModel.js")

var tradeSchema = mongoose.Schema({
    fromUser:[User],
    toUser: [User],
    bookWanted: [Book],
    tradeStatus: String
});
module.exports = mongoose.model("Trade", tradeSchema);


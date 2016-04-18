var mongoose = require("mongoose");
var User = require("./userModel.js")
var bookSchema = mongoose.Schema({
    //bookId: Number
    title: String,
    author: String,
    owner: [User],
    //username: String,
    description: String,

})

module.exports = mongoose.model("Book", bookSchema);


var mongoose = require("mongoose");
var bcrypt = require('bcrypt-nodejs');
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
})
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(user,password) {
    return bcrypt.compareSync(password, user.password);
};
module.exports = mongoose.model("User", userSchema);



var mongoose = require("mongoose");


module.exports= function(){
//setUpDb: function(){
mongoose.connect("mongodb://localhost/myapp");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("connected to database");
});

//},

return db;
}
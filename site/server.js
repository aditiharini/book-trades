//Server set-up
// var http = require("http");
// var server = http.createServer(function(request, response){
// //Defining router objects
// console.log("Server good");
// response.end("We're good");
// })
// server.listen(8080);

var express = require("express");
var mongoose = require("mongoose");
var path = require('path');
var app = express();
var bodyParser = require("body-parser");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
// var bCrypt = require('bcypt-nodejs');
var cookieParser = require('cookie-parser');
var busboyBodyParser = require('busboy-body-parser');
var expressSession = require('express-session');
var flash = require('connect-flash');
var db = require("./db.js")();
var User = require("./models/userModel.js");
var Book = require("./models/bookModel.js");
var Trade = require("./models/tradeModel.js");

require("./passport.js")(passport, User);
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true,
    uploadDir:__dirname+ "/uploads"
}));
app.use(bodyParser({uploadDir:'uploads'}));
app.use(busboyBodyParser({uploadDir:__dirname+ "/uploads"})) ;
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
    cookie:{
    expires : new Date(Date.now() + 3600000000)
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use("/", router);

router.use(function(request, response, next) {
    console.log(request.method, request.url);
    next();
});

require("./middleware.js")(router, passport, Book);
require("./authentication.js")(router, passport);
require("./managebooks.js")(router, passport, db, User, Book, Trade);



app.listen(8080, function() {
    console.log("listening on 8080");
})

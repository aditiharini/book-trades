var middleware = require("./middleware");
//var Book = require("/site/models/bookModel.js");
var mongoose = require("mongoose");
var path = require("path");
var fs = require("fs");


module.exports = function(router, passport, db, User, Book, Trade) {


    router.get("/your-books", isLoggedIn, function(request, response) {

        var collection = db.collection("books");
        Book.find({
            "owner.username": request.user.username
        },function(err, res) {
            if (err) {
                throw err;
            }
            response.render('yourbooks.ejs', {
                userBooks: res
            });
        });


    });

    router.post("/your-books", isLoggedIn, function(request, response) {
        console.log("posting");

        // var db = request.db;
        /*
            var title = request.body.title;
            var owner = request.body.owner;
            var description = request.body.description
        */
        console.log(request.user);
        var collection = db.collection("books");
        //var user = request.user;
        collection.insert({
                "title": request.body.title,
                //"owner": user,
                "owner": {username: request.user.username,
                        //password: request.user.pass,
                        email: request.user.email,
                        firstName: request.user.firstName,
                        lastName: request.user.lastName},
                "author": request.body.author,
                "description": request.body.description

            }

            ,
            function(err, doc) {
                if (err)
                // If it failed, return error
                    console.log("There was a problem adding the information to the database.");

                else {
                    // And forward to success page
                    response.redirect("/your-books");
                    console.log("add new book - title:" + request.body.title + ", owner:" + request.body.owner);
                }

            });
    });


    router.delete("/your-books/:bookId", function(request, response) {
        var collection = db.collection("books");
        collection.remove({
            _id: request.book._id
        }, function(err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
                fs.unlink(__dirname + "/uploads/" +request.params.bookId +".jpg", function(error){
                    console.log("deleted pic");
                });
            }

        });
        response.send("kjfsdf");

    });
    
    router.get("/uploads/:imageId", function(request, response) {
        var img = fs.readFileSync(__dirname + '/uploads/' + request.params.imageId + ".jpg");
        response.writeHead(200, {'Content-Type': 'image/jpg' });
        response.end(img, 'binary');
    });

    router.post("/your-books/:bookId", function(request, response) {
        //console.log(request);
        console.log(request.files);
        /* var tempPath = request.files.imgfile.path;
     console.log(tempPath);       
    fs.readFile(tempPath, function (err, data) {
  if(err){
      console.log(err);
  }
  */
        var newPath = __dirname + "/uploads/" + request.book._id.valueOf() + ".jpg";
        fs.writeFile(newPath, request.files.imgfile.data, function(err) {
            if (err) {
                console.log(err);
            }
        });

        // response.render("eachbook.ejs", {
        //     bookId: request.book._id.valueOf()
        // });
        response.redirect("/your-books/"+ request.params.bookId);

    });

    router.put("/your-books/:bookId", function(request, response) {

        //var bookId = new mongo.ObjectID(request.body.id);
        var title = request.body.title;
        var description = request.body.description;
        var collection = db.collection("books");
        collection.updateOne(
            //{"owner": "aditi"},
            {
                "_id": request.book._id
            }, {
                $set: {
                    "title": title,
                    "description": description
                }
            },

            function(err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(results);
                }
            });

        response.json({
            message: 'Update book info'
        });
    });

    router.get("/your-books/:bookId", isLoggedIn, function(request, response) {
        console.log(__dirname + "/uploads/" + request.book._id.valueOf() + ".jpg");
        response.render("eachbook.ejs", {
            bookId: request.book._id.valueOf(),
            description: request.book.description,
            title: request.book.title
        });
        
    });
    router.get("/info/:bookId", function (request, response){
            response.render('searchinfobook.ejs', {
                bookId: request.book._id.valueOf(), 
                description: request.book.description, 
                title: request.book.title
            }); 
            
    
    }); 
    
    router.get("/your-trades", isLoggedIn, function(request, response) {
        var collection = db.collection("trades");
        collection.find({
            "toUser.username": request.user.username
        }).toArray(function(err, tradesReceived) {
            if (err) {
                throw err;
            }
            collection.find({
                "fromUser.username": request.user.username
            }).toArray(function(err, tradesProposed) {
                if (err) {
                    throw err;
                }
                //console.log(tradesReceived);
                response.render('yourtrades.ejs', {
                    tradesReceived: tradesReceived,
                    tradesProposed: tradesProposed
                });

            });
        });
    });
    
    
    router.post("/your-trades", function(request, response) {
        console.log("got to post");
        var collection = db.collection("trades");
        if (request.body.id == "remove") {
            console.log("got to remove trade");
            Trade.remove({
                    "_id": request.body.tradeRemoved._id
                },
                function(err, trade) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        response.send(trade);
                    }
                })
        }
        else if (request.body.id == "status") {
            console.log("got to post trade");
            console.log(request.body.buttonId);
            console.log(request.body.tradeUpdated._id);
            Trade.update({
                    "_id": request.body.tradeUpdated._id
                }, {
                    $set: {
                        "tradeStatus": request.body.buttonId
                    }
                },
                function(err, trade) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        //console.log(trade);
                        response.send(trade);
                    }
                });
        }
        else if(request.body.id=="search"){
            console.log("got to search");
            var collection = db.collection("books");
            console.log(request.body.title);
            collection.find({
                $or: [{
                    title: {
                        '$regex': request.body.title,
                        $options: "i"
                    }
                }, {
                    author: {
                        '$regex': request.body.title,
                        $options: "i"
                    }
                }, {
                    "owner.username": {
                        '$regex': request.body.title,
                        $options: "i"
                    }
                }]
            }).toArray(function(err, res) {
                if (err) {
                    throw err;
                }

                console.log(res);
                response.send(res);
            });
        }
        else if(request.body.id=="proptrade"){
            console.log("got to propose trade");
            var collection = db.collection("trades");
            collection.insert({
                "fromUser":{
                    username: request.user.username,
                    email: request.user.email,
                    firstName: request.user.firstName,
                    lastName: request.user.lastName
                    
                } ,
                // "fromUser":request.user,
                "toUser": request.body.bookWanted.owner,
                "bookWanted": request.body.bookWanted,
                "tradeStatus": "pending"

            },function(err, doc) {
                if (err)
                // If it failed, return error
                    console.log("There was a problem adding the information to the database.");

                else {
                    response.send(doc);
                }

            });
        }
    });

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};
//var Book = require("./models/bookModel.js");
var mongoose = require("mongoose");

module.exports = function(router, db, Book) {
    router.post('/your-trades', function(request, response) {
        var collection = db.collection("books");
        collection.find({
            title: request.body.title
        }).toArray(function(err, res) {
            if (err) {
                throw err;
            }
            console.log(res);
            response.render('yourtrades', {
                data: res
            });
        });
    });

    router.get('/your-trades', function(req, res) {
        res.render("search");
    })
}
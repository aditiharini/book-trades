var mongo = require("mongodb");
//var Book = require("/site/models/bookModel.js");
var mongoose = require("mongoose");

module.exports = function(router, passport, Book){
    router.param("bookId", function(request, response, next, id) {
    var bookId = new mongo.ObjectID(id);
    Book.findOne({
        _id: bookId
    }, function(e, book) {
        if (e) return next(e);
        if (!book) return next(new Error('Nothing is found'));
        request.book = book;
        next();
    });
});

};
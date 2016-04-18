
var User= require("./models/userModel.js");
var mongoose = require("mongoose");

var LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport, User){
    
passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    }); 

 passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(request, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username}, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, request.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(user,password))
                return done(null, false, request.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            console.log(user);
            return done(null, user);
        });

    }));




passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(request, email, password, done) {

        console.log("signup func");

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            if (!request.body.username) {
                return done(null, false, request.flash('signupMessage', 'You must provide a username.'));
            }
            else {
                // find a user whose email is the same as the forms email, or a user with same username as forms username
                // we are checking to see if the user trying to login already exists
                User.findOne({$or: [{'email': email}, {'username': request.body.username}]}, function(err, user) {
                    // if there are any errors, return the error
                    console.log("Password " + password);
                    console.log("email " + email);
                    console.log("username " + request.body.username);
                    if (err) {
                        console.log("got to error");
                        return done(err);
                    }

                    // check to see if theres already a user with that email or that username
                    if (user) {
                        console.log("checking email/username");
                        return done(null, false, request.flash('signupMessage', 'That email or username is already taken.'));
                    }
                    else {
                        console.log("creating user");

                        // if there is no user with that email or that username

                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.email = email;
                        newUser.username = request.body.username;
                        newUser.password = newUser.generateHash(password);

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log("error creating user");
                                throw err;
                            }
                            console.log("user created");
                            return done(null, newUser);
                        });
                    }
                });
            }
        });

    } ));
}    
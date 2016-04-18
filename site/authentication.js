var middleware = require("./middleware");

module.exports = function(router,passport){
    router.get("/", function(request, response) {
    response.render("homepage.ejs");
   // console.log(request.user.username);
    //console.log("home page");
});

router.get("/login", function(request, response) {
    response.render('login.ejs', {
        message: request.flash('loginMessage')
    });
});

router.post("/login", passport.authenticate("local-login", {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
    session: true
}));

router.get("/signup", function(request, response) {
    response.render('signup.ejs', { 
        message: request.flash('signupMessage') 
    });
});

router.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/signup",
    failureFlash: true,
    session: true
}));

router.get("/profile", isLoggedIn, function(request, response){
    response.render("profile.ejs",{
        user: request.user
    });
    console.log(request.user);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
    });

 function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
        else{

    // if they aren't redirect them to the home page
    res.redirect('/login');
        }
}

}
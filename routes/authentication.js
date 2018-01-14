var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


// register
router.get("/register", function(req, res) {
    res.render("auth/register")
});

// create user
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp" + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

// login
router.get("/login", function(req, res) {
    res.render("auth/login");
});

// login user
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res) {
    //req.flash("success", "Welcome to YelpCamp" + user.username);
});

// logout
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out");
    res.redirect("/campgrounds");
});

module.exports = router;
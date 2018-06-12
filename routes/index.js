var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");

//root
router.get("/", function(req, res){
        res.render("landing");
});
    

//Auth routes
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up
router.post("/register", function(req, res) {
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           //console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp"+user.username);
           res.redirect("/campgrounds");
       });
   }) ;
});


//login routes
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
        
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You've been logged out!")
    res.redirect("/campgrounds");
});

module.exports = router;
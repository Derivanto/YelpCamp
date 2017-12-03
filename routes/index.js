var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");

//ROUTES
router.get("/", function(req, res){
    res.render("landing");
});



// AUTHENTICATION ROUTES
router.get("/register", function(req, res){
    res.render("register", {page: "register"});
});

router.post("/register", function(req, res){
    var newUser = new User(
        {
            username: req.body.username, 
            firstName: req.body.firstName.charAt(0).toUpperCase() + req.body.firstName.slice(1).toLowerCase(), 
            lastName: req.body.lastName.charAt(0).toUpperCase() + req.body.lastName.slice(1).toLowerCase(), 
            email: req.body.email, 
            picture: req.body.picture
        });
    // eval(require('locus'));
    if (req.body.adminCode === 'test') {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to YelpCamp " + user.username);
               res.redirect("/campgrounds"); 
            });
        }
    });
});

//login routes
router.get("/login", function(req, res){
   res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }) ,function(req, res){
});

// user profile (to be moved to user routes maybe)
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
    if(err || !foundUser){
        req.flash("error", "User profile not found");
        res.redirect("/campgrounds");
    }else {
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, foundCamps){
           if(err) {
               req.flash("error", "Something went wrong");
               res.redirect("/");
           }
            res.render("users/show", {user: foundUser, campgrounds: foundCamps});
        });
       
    }
   });
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged Out Succesfuly!");
    res.redirect("/campgrounds");
});

module.exports = router;

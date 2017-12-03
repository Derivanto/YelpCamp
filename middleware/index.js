// all middleware
var middlewareObj = {};
var Campground = require("../models/campground");
var Comment = require("../models/comment");

middlewareObj.isCampgroundAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground){
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }else if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else {
                req.flash("error", "Try to edit only the campgrounds that you have created");
                res.redirect("back");
            }
        });
    }else {
        req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
};

middlewareObj.isCommentAuthor = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                console.log(err);
                req.flash("error", "Comment not found");
                res.redirect("back");
            }else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
            } else {
                req.flash("error", "Try to edit only your comments");
                res.redirect("back");
            }
        });
    }else {
        req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
};



module.exports = middlewareObj;
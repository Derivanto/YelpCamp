var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //require the index.js file by default if only a folder is specified

//NEW COMMENT FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if (err){
           console.log((err));
       }else {
            res.render("comments/new", {campground: campground});
       }
   });
});

//CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err){
            console.log((err));
            res.redirect("/campgrounds");
        }else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    console.log("New comment was added to \"" + campground.name + "\" campground from user: \"" + req.user.username + "\"");
                    req.flash("success", "Added new comment to " + campground.name);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT
router.get("/:comment_id/edit", middleware.isCommentAuthor, function(req, res){
     Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        } 
        Comment.findById(req.params.comment_id, function(err, foundComment){
             if(err){
                 console.log(err);
                 res.redirect("back");
             }else {
                res.render("comments/edit", {comment:foundComment, campground_id:req.params.id});
             }
        });
     });
});

//UPDATE
router.put("/:comment_id", middleware.isCommentAuthor, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           console.log(err);
           res.redirect("/campgrounds/" + req.params.id);
       }else {
           console.log("UPDATED KAPPA\n" + updatedComment);
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//DELETE
router.delete("/:comment_id", middleware.isCommentAuthor,function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
            console.log(err);
            res.redirect("back");
       }else{
           req.flash("success", "Comment deleted successfuly");
           res.redirect("back");
       }
   }) 
});

module.exports = router;
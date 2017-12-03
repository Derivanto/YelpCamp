var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //require the index.js file by default if only a folder is specified
var geocoder = require("geocoder");

//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allgrounds, page: "campgrounds"});
        }
    });
    // res.render("campgrounds", {campgrounds: campGrounds});
});
//CREATE
router.post("/", middleware.isLoggedIn , function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function(err, data){
        if(err){
            console.log(err);
        } else {
             if (data.hasOwnProperty('error_message')){
               req.flash("error", "google maps fail: " + data.error_message + ".....................................Try again in few seconds or later");
               res.redirect("campgrounds/new");
           } else {
                console.log(data);
                console.log(".....................................................\n" + data.results[0].geometry.location);
                var latitude = data.results[0].geometry.location.lat;
                var longitude = data.results[0].geometry.location.lng;
                var location = data.results[0].formatted_address;
                var newCampgroung = {name: name, price: price, image: image, description: description, author: author, location: location, latitude: latitude, longitude: longitude};
                Campground.create(newCampgroung, function(err, camp){
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect("/campgrounds");
                    }
                });
           }
        }
    });
});

//NEW
router.get("/new", middleware.isLoggedIn ,function(req, res){
   res.render("campgrounds/new");
});

//SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "campground not found");
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.isCampgroundAuthor ,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE
router.put("/:id", middleware.isCampgroundAuthor ,function(req, res){
    geocoder.geocode(req.body.campground.location, function(err, data){
        if(err){
            console.log(err);
        }else {
            // console.log(req.params.id);
           if (data.hasOwnProperty('error_message')){
               req.flash("error", "google maps fail: " + data.error_message + ".....................................Try again in few seconds or later");
               res.redirect("/campgrounds/" + req.params.id);
           } else {
                var newData = req.body.campground;
                newData.latitude = data.results[0].geometry.location.lat;
                newData.longitude = data.results[0].geometry.location.lng;
                newData.location = data.results[0].formatted_address;
                Campground.findByIdAndUpdate(req.params.id, newData, function(err, updatedCampground){
                    if(err){
                     console.log(err);
                    }  else {
                     res.redirect("/campgrounds/"+req.params.id);
                    }
               });
           }
        }
    });
});

//DELETE
router.delete("/:id", middleware.isCampgroundAuthor ,function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;
var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


// INDEX page display all the campgrounds
router.get("/campgrounds", function (req, res) {
    // Get all the campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

// NEW - show form to create new campgrounds
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
//   get data from the form
    var name          = req.body.name,
        price         = req.body.price,
        image         = req.body.image,
        desc          = req.body.desc,
        author        ={
                            id: req.user._id,
                            username: req.user.username
                        },
        newCampground = {name: name, image: image, description: desc, author: author, price: price};
    //Create a new campground amd save to DB  
    Campground.create(newCampground, function(err, newlyCreated) {
            if(err){
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        });
});

router.get("/campgrounds/:id", function(req, res) {
    // find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground})
        }
    });
});

// Edit Campground Route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
             res.render("campgrounds/edit", {campground: foundCampground});
    });
});



// Update Campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    } )
    // redirect somewhere
});

// Destroy the campground
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership,function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;
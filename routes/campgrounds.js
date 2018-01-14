var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// index
router.get("/", function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if(err) console.log(err);
		res.render("campgrounds/campgrounds", {campgrounds: allCampgrounds});
	});
});

// new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// create campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {
        name: req.body.cg.name,
        price: req.body.cg.price,
        image: req.body.cg.image,
        description: req.body.cg.description,
        author: author
    }
	Campground.create(newCampground, function(err) {
		if(err) console.log(err);
	});
	
	res.redirect("/campgrounds");
});

// show campground
router.get("/:id", function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
		if(err) console.log(err);
		res.render("campgrounds/show", {campground: foundCamp});
	});
});

// edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", {campground: foundCamp});
        }
    });
});

// update campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.cg, function(err, foundCamp) {
		if(err) {
            console.log(err);
        } else {
            req.flash("success", "Sucessfully edited campground");
            res.redirect("/campgrounds/" + req.params.id);
        }
	});
});

// destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "Sucessfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;
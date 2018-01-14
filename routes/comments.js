var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) console.log(err);
        res.render("comments/new", {campground: foundCampground});
    });
});

// create comment
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) console.log(err);
        Comment.create(req.body.comment, function(err, comment) {
            if(err) console.log(err);
            comment.author.username = req.user.username;
            comment.author.id = req.user._id;
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
        })
    });
});

// edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) console.log(err);
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    });
});

// update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    var updateComment = {
        text: req.body.text
    };
    Comment.findByIdAndUpdate(req.params.comment_id, updateComment, function(err) {
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "Sucessfully updated comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            console.log(err);
        } else {
            req.flash("success", "Sucessfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


module.exports = router;
var Campground = require("../models/campground");
var Comment = require("../models/comment");


middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated())
        return next();
    req.flash("error", "You must be logged in");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in");
        res.redirect("/login");
    } else {
        Campground.findById(req.params.id, function(err, foundCamp) {
            if(err) {
                console.log(err);
                req.flash("error", "Campground not found on database");
                res.redirect("back");
            } else {
                if(!foundCamp.author.id.equals(req.user._id)) {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
                else
                    next();
            }
        });
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(!req.isAuthenticated()){
        req.flash("error", "You must be logged in");
        res.redirect("/login");
    } else {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                console.log(err);
                req.flash("error", "Comment not found on database");
                res.redirect("back");
            } else {
                if(!foundComment.author.id.equals(req.user._id)) {
                    req.flash("error", "You don't have permission");
                    res.redirect("back");
                }
                else
                    next();
            }
        });
    }
}



module.exports = middlewareObj;
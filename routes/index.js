var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");

router.get("/seed", function(req, res) {

    var seed_users = [
        {username: "bot1"},
        {username: "bot2"},
        {username: "bot3"}
    ];
    
    var description_string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
	var seed_campgrounds = [
		{name: "camp1", price: "10",image: "http://3.bp.blogspot.com/-2A8bMww4C-o/TbYk5v4xszI/AAAAAAAAcXA/hHL9S2iA1Mw/s1600/camping.gif",description: description_string}
        ,
		{name: "camp2", price: "20",image: "http://www.whitewaterchallengers.com/wp-content/uploads/2015/02/Tent-Camping-at-Lehigh-River-Adventure-Center-In-Poconos-PA.jpg",description: description_string},
		{name: "camp3", price: "30",image: "http://www.travelbirbilling.com/wp-content/uploads/camp-pic1.jpg",description: description_string}
	];
    
    isDone = 0;
    User.remove({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("removed all users");
            Campground.remove({}, function(err) {
                if(err){
                    console.log(err);
                } else {
                    console.log("removed all campgrounds");
                    Comment.remove({}, function(err) {
                        if(err){
                            console.log(err);
                        } else {
                            console.log("removed all comments");
                            seed_users.forEach(function(usr) {
                                User.register(usr, "password", function(err, user) {
                                    if(err){
                                        console.log(err);
                                    } else {
                                        console.log("registered " + user.username);
                                        console.log("camping user " + user.username);
                                        seed_campgrounds.forEach(function(item) {
                                            var author = {
                                                id: user._id,
                                                username: user.username
                                            };
                                            var newCampground = {
                                                name: user.username + "_" + item.name,
                                                price: item.price,
                                                image: item.image,
                                                description: item.description,
                                                author: author
                                            };
                                            Campground.create(newCampground, function(err, campground) {
                                                if(err){
                                                    console.log(err);
                                                } else {
                                                    console.log("created " + campground.name);
                                                    var newComment = {
                                                        text: "meu",
                                                        author: campground.author
                                                    };
                                                    Comment.create(newComment, function(err, comment) {
                                                        if(err) {
                                                            console.log(err);
                                                        } else {
                                                            campground.comments.push(comment);
                                                            campground.save();
                                                            isDone++;
                                                            if(isDone === seed_campgrounds.length*seed_users.length)
                                                            {
                                                                res.redirect("/campgrounds");
                                                            }
                                                        }
                                                    }); // create comment
                                                }
                                            }); // create campground
                                        }); // forEach campground
                                    }
                                }); // register user
                            }); // forEach user
                            //res.redirect("/campgrounds");
                        }
                    }); // rm comments
                }
            }); // rm campgrounds
        }
    }); // rm users
});

// landing
router.get("/", function(req, res) {
	res.render("landing");
});



module.exports = router;
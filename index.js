var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var User = require("./models/user");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authenticationRoutes = require("./routes/authentication");

app.set("port", (process.env.PORT || 3000));

mongoose.connect(process.env.MONGODB);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());

// passport configuration
app.use(require("express-session")({
    secret: "frase generica para encriptar",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authenticationRoutes);



app.listen(app.get("port"), function() {
	console.log("The YelpCamp Server is Running!");
});

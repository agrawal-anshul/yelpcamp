const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
require("dotenv").config();

// requiring routes
const indexRoutes = require("./routes/index");

const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const adRoute = require("./routes/ads");
const url = process.env.DATABASE_URL;
mongoose.connect(url, { useMongoClient: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //serves public directory automatically so use ./<folder name> for directories in public forlder
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); seed the database

// PASSPORT CONFIGURATION
app.use(
    require("express-session")({
        secret: "No, George Lucas. Han DID shoot first!",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/ads", adRoute);

app.listen(process.env.PORT, process.env.IP, function () {
    console.log(
        "The aDVENTURE Server Has Started on Port " + process.env.PORT + "!"
    );
});

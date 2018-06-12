var express = require("express"),
        app = express(),
        flash = require("connect-flash"),
        bodyparser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require("passport"),
        localStrategy = require("passport-local"),
        Campground= require("./models/campground"),
        User = require("./models/User"),
        seedDB = require("./seeds"),
        Comment =require("./models/comment"),
        methodOverride = require("method-override");

var commentRoutes= require("./routes/comments"),
     campgroundRoutes = require("./routes/campgrounds"),
     indexRoutes = require("./routes/index");
       
mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyparser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); 

//passport config
app.use(require("express-session")({
    secret: "Vaish is the bestest!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//to pass currentuser to all the routes, this middleware is created
app.use(function(req, res, next){
    res.locals.currentUser=req.user; //res.locals is whatever is avaible in templates
    res.locals.error = req.flash("error"); //to pass on the rrorerror variable to all the routes
    res.locals.success = req.flash("success"); 
    next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
        console.log("YelpCamp server started");
});
    

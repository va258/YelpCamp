var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

//index
router.get("/", function(req, res){
        Campground.find({},function(err, allCampgrounds){
            if(err){
                console.log("error");
            }
            else{
               res.render("campgrounds/index",{camps : allCampgrounds, currentUser: req.user}); 
            }
        });
});
    
//create
router.post("/",middleware.isLoggedin, function(req, res){
        var name= req.body.name;
        var price = req.body.price;
        var image= req.body.image;
        var description = req.body.description;
        var author={
            id: req.user._id,
            username: req.user.username
        };
        var newCampground={name: name, price: price, image: image, description: description, author: author};
        Campground.create(newCampground, function(err, camp){
        if(err){
            console.log("Save failed");
        }
        else{
            console.log("New campground added");
            console.log(camp);
            res.redirect("/campgrounds");
        }
    });   
     
});
    
//new   
router.get("/new",middleware.isLoggedin, function(req, res) {
       res.render("campgrounds/new") ;
});
    
//show
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCamp){
        if(err){
            console.log("error");
        }else{
            res.render("campgrounds/show", {camp: foundCamp}); 
        }
    });
   
});

//edit camp
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCamp){
       res.render("campgrounds/edit", {camp: foundCamp});
    });
});

//update post after edit route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id,req.body.camp, function(err, foundCamp){
        if(err){
            console.log(err);
        }else{
          res.redirect("/campgrounds/"+req.params.id);  
        }
    });
});

//destroy post
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;

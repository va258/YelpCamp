//all the middleware
var Campground= require("../models/campground");
var Comment= require("../models/comment");
var middlewareObj={};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
           res.redirect("back");
        }else{
           //does user own the post?
           if(foundCamp.author.id.equals(req.user._id)){
               next();
           }else{
               res.redirect("back");
           }
             
        }
    }); 
    }else{
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            req.flash("error", "Campground not found!")
           res.redirect("back");
        }else{
           //does user own the comment?
           if(foundComment.author.id.equals(req.user._id)){
               next();
           }else{
               req.flash("error", "Permission denied!")
               res.redirect("back");
           }
             
        }
    }); 
    }else{
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("back");
    }
};

middlewareObj.isLoggedin = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in!")
    res.redirect("/login");
};

module.exports= middlewareObj;
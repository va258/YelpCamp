var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");


//comments new
router.get("/new",middleware.isLoggedin ,function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            //console.log(campground);
            res.render("comments/new", {camp: campground});
        }
    });
});


//comments create
router.post("/", middleware.isLoggedin,function(req, res){
    
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        }else{
            var comment = req.body.comment;
            Comment.create(comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong!")
                    console.log(err);
                }else{
                    //add username and id to comment and then save
                    comment.author.id= req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment added!")
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});


//route to edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
        }
    });
    
});


//to update comment after edit form
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});



//Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Successfully deleted!")
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router;
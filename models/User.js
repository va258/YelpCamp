var mongoose = require("mongoose");
var passportLocalMpongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password : String
});

UserSchema.plugin(passportLocalMpongoose);

module.exports = mongoose.model("User", UserSchema);
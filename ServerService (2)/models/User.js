const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');
const UserSchema = new Schema({
    full_name: {type: String, required:true},
    email:{type:String,required:true, unique: true},
    password:{type:String,required:true},
    role:{type:String,default:'user'},
    credit:{type:Number,default:10000}
});
UserSchema.plugin(timestamps);
module.exports = mongoose.model("User", UserSchema);

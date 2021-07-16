const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const SettingSchema = new Schema ({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    days:{type:Number, default:14, required:true}
});

SettingSchema.plugin(timestamps);
module.exports = mongoose.model("Setting",SettingSchema);
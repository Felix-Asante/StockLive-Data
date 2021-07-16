const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const SettingAdminSchema = new Schema ({
    adminId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    exchangeSegment: {type: String},
    symbolNames: {type: Array},
    series:{type:Array},
    days:{type:Number, default:14, required:true},
});

SettingAdminSchema.plugin(timestamps);
module.exports = mongoose.model("SettingAdmin",SettingAdminSchema);
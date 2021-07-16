const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const eventSettingSchema = new Schema ({
    adminId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    eventCode:{type:Number}
});

eventSettingSchema.plugin(timestamps);
module.exports = mongoose.model("EventSetting",eventSettingSchema);


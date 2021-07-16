const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const cornDaySettingSchema = new Schema ({
    adminId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    CornDeleteDay:{type:Number}
});

cornDaySettingSchema.plugin(timestamps);
module.exports = mongoose.model("CornDaySetting",cornDaySettingSchema);


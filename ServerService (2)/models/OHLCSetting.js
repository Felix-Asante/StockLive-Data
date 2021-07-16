const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const OHLCSettingSchema = new Schema ({
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    exchangeSegment:{type:String},
    exchangeInstrumentID: {type:Number},
    startTime:{type:String},
    endTime:{type:String},
    compressionValue:{type:Number}
});

OHLCSettingSchema.plugin(timestamps);
module.exports = mongoose.model("OHLCSetting",OHLCSettingSchema);
const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const MasterAdminSchema = new Schema ({
    ExchangeSegment:{type: String},
    ExchangeInstrumentID: {type: Number,unique: true},
    Description:{type:String},
    Name: {type: String},
    Series:{type:String},
    Timestamp:{type:Date},
    Status:{type:Boolean,default:false}
});

MasterAdminSchema.plugin(timestamps);
module.exports = mongoose.model("MasterAdmin", MasterAdminSchema );
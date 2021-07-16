const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const MasterSchema = new Schema ({
    ExchangeSegment:{type: String}, //NSECM or NSCFO or BSECM
    ExchangeInstrumentID: {type: Number,unique: true},//token number
    Description:{type:String},//
    Name: {type: String},//symbol name
    Series:{type:String},//EQ(in NSECM) //FUTSTK,FUTIDX,OPTIDX(in NSCFO)
    Timestamp:{type:Date}
});

MasterSchema.plugin(timestamps);
module.exports = mongoose.model("Master", MasterSchema );
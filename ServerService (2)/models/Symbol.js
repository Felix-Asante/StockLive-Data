const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const SymbolSchema = new Schema ({
    Userid:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    ExchangeSegment:{type: String},
    ExchangeInstrumentID: {type: Number,unique:true},
    Description:{type:String},
    Name: {type: String},
    Series:{type:String},
    Timestamp:{type:Date},
});

SymbolSchema.plugin(timestamps);
module.exports = mongoose.model("Symbol",SymbolSchema);
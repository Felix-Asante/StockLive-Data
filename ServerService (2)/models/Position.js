const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const PositionSchema = new Schema ({
    OrderUserid:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    ProductType:{type:String},
    ExchangeSegment:{type:String},
    ExchangeInstrumentId:{type:Number}, //need to work
    SymbolName:{type:String},
    TransactionType:{type:String},
    PositionQuantity:{type:Number,required:true},
    PositionPrice:{type:Number,required:true}
});

PositionSchema.plugin(timestamps);
module.exports = mongoose.model("Position",PositionSchema);
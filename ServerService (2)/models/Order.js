const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const OrderSchema = new Schema ({
    OrderUserid:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    OrderTimestamp:{type:Date},
    TransactionType:{type:String},
    ExchangeSegment:{type:String},
    ExchangeInstrumentId:{type:Number}, //need to work
    SymbolName:{type:String},
    OrderQuantity:{type:Number},
    OrderType:{type:String},
    ProductType:{type:String},//Intraday-- MIS, Delivery -NRML
    OrderPrice:{type:Number},
    TriggerPrice:{type:Number,default:0},
    DisclosedQuantity:{type:Number,default:0},
    Duration:{type:String,default:'DAY'},
    Status:{type:String}, // complete, reject, open, cancel
    Remark:{type:String},
    // is_amo
    // stoploss
    // squareoff
    // trailing_ticks
});

OrderSchema.plugin(timestamps);
module.exports = mongoose.model("Order",OrderSchema);
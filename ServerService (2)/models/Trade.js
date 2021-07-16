const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const TradeSchema = new Schema ({
    OrderId:{type:mongoose.Schema.Types.ObjectId, ref:'Order',unique: true, required:true},
    ExchangeTime:{type:Date},
    TradeQuantity:{type:Number}, //executed quantity
    TradePrice:{type:Number}, //Avg Price // depeneded on quantity
    UserId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
});

TradeSchema.plugin(timestamps);
module.exports = mongoose.model("Trade",TradeSchema);
const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

//tle => Touch line event
const tleLiveDataAdminSchema = new Schema ({
    MessageCode:{type:Number},
    ExchangeSegment:{type:Number},
    ExchangeInstrumentID:{type:Number},
    ExchangeTimeStamp:{type:Number},
    LastTradedPrice:{type:Number},
    LastTradedQunatity:{type:Number},
    TotalBuyQuantity:{type:Number},
    TotalSellQuantity:{type:Number},
    TotalTradedQuantity:{type:Number},
    AverageTradedPrice:{type:Number},
    LastTradedTime:{type:Number},
    LastUpdateTime:{type:Number},
    PercentChange:{type:Number},
    Open:{type:Number},
    High:{type:Number},
    Low:{type:Number},
    Close:{type:Number},
    TotalValueTraded:{type:Number},
    BidInfo:{type:Array},
    AskInfo:{type:Array}
});

tleLiveDataAdminSchema.plugin(timestamps);
module.exports = mongoose.model("Tle",tleLiveDataAdminSchema);


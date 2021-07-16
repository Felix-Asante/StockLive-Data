const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const LiveDataSchema = new Schema ({
    SymbolId:{type:mongoose.Schema.Types.ObjectId, ref:'Sumbol', required:true},
    UserId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    ExchangeTimeStamp:{type:Number},
    IndexName:{type:String},
    IndexValue:{type:Number},
    OpeningIndex:{type:Number},
    ClosingIndex:{type:Number},
    HighIndexValue:{type:Number},
    LowIndexValue:{type:Number},
    PercentChangeIDE:{type:Number},
    NoOfUpmoves:{type:Number},
    NoOfDownmoves:{type:Number},
    MarketCapitalisation:{type:Number},
    OIE_ExchangeTimeStamp:{type:Number},
    XTSMarketType:{type:Number},
    OpenInterest:{type:Number},
    BarTime:{type:Number},
    BarVolume:{type:Number},
    SumOfQtyInToPrice:{type:Number},
    LastTradedPrice:{type:Number},
    LastTradedQunatity:{type:Number},
    TotalBuyQuantity:{type:Number},
    TotalSellQuantity:{type:Number},
    TotalTradedQuantity:{type:Number},
    AverageTradedPrice:{type:Number},
    LastTradedTime:{type:Number},
    LastUpdateTime:{type:Number},
    PercentChangeMDE:{type:Number},
    Open:{type:Number},
    High:{type:Number},
    Low:{type:Number},
    Close:{type:Number},
    TotalValueTraded:{type:Number},
    BuyBackTotalBuy:{type:Number},
    BuyBackTotalSell:{type:Number},
    result:{type:Array}
});

LiveDataSchema.plugin(timestamps);
module.exports = mongoose.model("LiveData",LiveDataSchema);
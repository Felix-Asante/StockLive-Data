const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

// IDE => Index Data Event
const IdeLiveDataAdminSchema = new Schema ({
    MessageCode:{type:Number},
    MessageVersion:{type:Number},
    ApplicationType:{type:Number},
    TokenID:{type:Number},
    ExchangeSegment:{type:Number},
    ExchangeInstrumentID:{type:Number},
    ExchangeTimeStamp:{type:Number},
    IndexName:{type:String},
    IndexValue:{type:Number},
    OpeningIndex:{type:Number},
    ClosingIndex:{type:Number},
    HighIndexValue:{type:Number},
    LowIndexValue:{type:Number},
    PercentChange:{type:Number},
    YearlyHigh:{type:Number},
    YearlyLow:{type:Number},
    NoOfUpmoves:{type:Number},
    NoOfDownmoves:{type:Number},
    MarketCapitalisation:{type:Number},
    SequenceNumber:{type:Number}
});

IdeLiveDataAdminSchema.plugin(timestamps);
module.exports = mongoose.model("Ide",IdeLiveDataAdminSchema);


const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

// Candle Depth Event
const CdeLiveDataAdminSchema = new Schema ({
    ApplicationType:{type:Number},
    BarTime:{type:Number},
    BarVolume:{type:Number},
    Close:{type:Number},
    ExchangeInstrumentID:{type:Number},
    ExchangeSegment:{type:Number},
    High:{type:Number},
    Low:{type:Number},
    MessageCode:{type:Number},
    MessageVersion:{type:Number},
    Open:{type:Number},
    OpenInterest:{type:Number},
    SumOfQtyInToPrice:{type:Number},
    TokenID:{type:Number}
});

CdeLiveDataAdminSchema.plugin(timestamps);
module.exports = mongoose.model("Cde",CdeLiveDataAdminSchema);


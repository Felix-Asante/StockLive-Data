const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

//Oie => Open interest event
const OieLiveDataAdminSchema = new Schema ({
    MessageCode:{type:Number},
    MessageVersion:{type:Number},
    ApplicationType:{type:Number},
    TokenID:{type:Number},
    ExchangeSegment:{type:Number},
    ExchangeInstrumentID:{type:Number},
    ExchangeTimeStamp:{type:Number},
    XTSMarketType:{type:Number},
    OpenInterest:{type:Number}
});

OieLiveDataAdminSchema.plugin(timestamps);
module.exports = mongoose.model("Oie",OieLiveDataAdminSchema);


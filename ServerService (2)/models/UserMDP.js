const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const userMDPLiveDataAdminSchema = new Schema ({
        MessageCode:{type:Number},
        MessageVersion:{type:Number},
        ApplicationType:{type:Number},
        TokenID:{type:Number},
        ExchangeSegment:{type:Number},
        ExchangeInstrumentID:{type:Number},
        ExchangeTimeStamp:{type:Number},
        Bids:{type:Array},
        Asks:{type:Array},
        Touchline:{type:Array},
        BookType:{type:Number},
        XMarketType:{type:Number},
        SequenceNumber:{type:Number}
});

userMDPLiveDataAdminSchema.plugin(timestamps);
module.exports = mongoose.model("UserMDP",userMDPLiveDataAdminSchema);


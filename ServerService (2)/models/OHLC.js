const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const ohlcDataSchema = new Schema ({
    exchangeSegment:{type:String},
    exchangeInstrumentID:{type:String},
    dataReponse:{type:String}
});

ohlcDataSchema.plugin(timestamps);
module.exports = mongoose.model("OHLC",ohlcDataSchema);


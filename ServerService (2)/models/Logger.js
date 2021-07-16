const mongoose = require("mongoose");
var timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

const LoggerSchema = new Schema ({
    message:{type:String},
    fileId:{type:String}
});

LoggerSchema.plugin(timestamps);
module.exports = mongoose.model("Logger",LoggerSchema);


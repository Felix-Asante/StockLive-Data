// {
//     "AccountID": "SYMP1",
//     "TradingSymbol": "ACC",
//     "ExchangeSegment": "NSECM",
//     "ExchangeInstrumentID": "22",
//     "ProductType": "CNC",
//     "Marketlot": "1",
//     "Multiplier": "1",
//     "BuyAveragePrice": "41.78",
//     "SellAveragePrice": "41.63",
//     "OpenBuyQuantity": 40,
//     "OpenSellQuantity": 0,
//     "Quantity": 40,
//     "BuyAmount": "1,671.00",
//     "SellAmount": "2,498.00",
//     "NetAmount": "827.00",
//     "UnrealizedMTM": "-2.33",
//     "RealizedMTM": "-5.67",
//     "MTM": "-7.99999999999997",
//     "BEP": "-41.35",
//     "SumOfTradedQuantityAndPriceBuy": "1,671.00",
//     "SumOfTradedQuantityAndPriceSell": "2,498.00",
//     "MessageCode": "9002"
//     "MessageVersion": "1"
//     "TokenID": "0"
//     "ApplicationType": "0"
//     "SequenceNumber": "180248277233929"
//    }

const Position = require("../models/Position");
const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
var CronJob = require('cron').CronJob;
const mongoose = require('mongoose');

router.get("/getAllPosition",verifyToken,async(req,res)=>{
    try{
        let position = await Position.find({OrderUserid:req.decoded._id});
        res.json({
            success:true,
            status_code:  201,
            data: position,
            numofdata:position.length,
            message: "Get all position records !"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

const drop_position_collection=()=>{
    mongoose.connection.db.listCollections({name: 'positions'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('positions', function(err, result) {
                   console.log("Position Collection Dropped !");
                });
            }
        });
}

var job44 = new CronJob('00 00 00 * * 0-6', function() { // 12 am
    drop_position_collection();
}, null, true, 'Asia/Kolkata');
job44.start();

module.exports=router
const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const LiveData = require("../models/LiveData");
const mongoose = require('mongoose');
router.post("/saveLiveData",verifyToken, async(req, res) => {
    try
    {
        let livedata = new LiveData();
            livedata.SymbolId=req.body.symbolId;
            livedata.UserId=req.decoded._id;
            livedata.ExchangeTimeStamp=req.body.exchangeTimeStamp;
            livedata.IndexName=req.body.indexName;
            livedata.IndexValue=req.body.indexValue;
            livedata.OpeningIndex=req.body.openingIndex;
            livedata.ClosingIndex=req.body.closingIndex;
            livedata.HighIndexValue=req.body.highIndexValue;
            livedata.LowIndexValue=req.body.lowIndexValue;
            livedata.PercentChangeIDE=req.body.percentChangeIDE;
            livedata.NoOfUpmoves=req.body.noOfUpmoves;
            livedata.NoOfDownmoves=req.body.noOfDownmoves;
            livedata.MarketCapitalisation=req.body.marketCapitalisation;
            livedata.OIE_ExchangeTimeStamp=req.body.oieexchangeTimeStamp;
            livedata.XTSMarketType=req.body.xtsMarketType;
            livedata.OpenInterest=req.body.openInterest;
            livedata.BarTime=req.body.barTime;
            livedata.BarVolume=req.body.barVolume;
            livedata.SumOfQtyInToPrice=req.body.sumOfQtyInToPrice;
            livedata.LastTradedPrice=req.body.lastTradedPrice;
            livedata.LastTradedQunatity=req.body.lastTradedQunatity;
            livedata.TotalBuyQuantity=req.body.totalBuyQuantity;
            livedata.TotalSellQuantity=req.body.totalSellQuantity;
            livedata.TotalTradedQuantity=req.body.totalTradedQuantity;
            livedata.AverageTradedPrice=req.body.averageTradedPrice;
            livedata.LastTradedTime=req.body.lastTradedTime;
            livedata.LastUpdateTime=req.body.lastUpdateTime;
            livedata.PercentChangeMDE=req.body.percentChangeMDE;
            livedata.Open=req.body.open;
            livedata.High=req.body.high;
            livedata.Low=req.body.low;
            livedata.Close=req.body.close;
            livedata.TotalValueTraded=req.body.totalValueTraded;
            livedata.BuyBackTotalBuy=req.body.buyBackTotalBuy;
            livedata.BuyBackTotalSell=req.body.buyBackTotalSell;
            LiveDataAdmin.Result=req.body.result;
        await livedata.save();
        res.json({
            success: true,
            status_code:  201,
            message: "live data saved successfully!"
        });
    }
    catch (err) {
        res.status(500).json({
        success: false,
        status_code: 500,
        message: err.message
        });
    }
});

router.get("/deleteLiveDataCollection",verifyToken,(req,res)=>{
    try{
        mongoose.connection.db.listCollections({name: 'livedatas'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('livedatas', function(err, result) {
                    res.json({
                        success:true,
                        status_code:  201,
                        message:"Live Data Collection Dropped !"
                    });
                });
            }
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


module.exports=router
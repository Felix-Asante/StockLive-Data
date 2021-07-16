const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const LiveDataAdmin = require("../models/LiveDataAdmin");
const MasterAdmin = require("../models/MasterAdmin");
const EventSetting = require("../models/EventSetting");
const mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
const livedataMigrateFromMongodbToGoogleDrive = require("../utils/google2.js");
const {callMasterAPI,stopLiveAdminDataSaveIntoMongodb} = require("../utils/livedataAPICaller.js");


router.post("/saveLiveDataAdmin",verifyToken, async(req, res) => {
    try
    {
        let liveDataAdmin = new LiveDataAdmin();
            liveDataAdmin.SymbolId=req.body.symbolId;
            liveDataAdmin.UserId=req.decoded._id;
            liveDataAdmin.ExchangeTimeStamp=req.body.exchangeTimeStamp;
            liveDataAdmin.IndexName=req.body.indexName;
            liveDataAdmin.IndexValue=req.body.indexValue;
            liveDataAdmin.OpeningIndex=req.body.openingIndex;
            liveDataAdmin.ClosingIndex=req.body.closingIndex;
            liveDataAdmin.HighIndexValue=req.body.highIndexValue;
            liveDataAdmin.LowIndexValue=req.body.lowIndexValue;
            liveDataAdmin.PercentChangeIDE=req.body.percentChangeIDE;
            liveDataAdmin.NoOfUpmoves=req.body.noOfUpmoves;
            liveDataAdmin.NoOfDownmoves=req.body.noOfDownmoves;
            liveDataAdmin.MarketCapitalisation=req.body.marketCapitalisation;
            liveDataAdmin.OIE_ExchangeTimeStamp=req.body.oieexchangeTimeStamp;
            liveDataAdmin.XTSMarketType=req.body.xtsMarketType;
            liveDataAdmin.OpenInterest=req.body.openInterest;
            liveDataAdmin.BarTime=req.body.barTime;
            liveDataAdmin.BarVolume=req.body.barVolume;
            liveDataAdmin.SumOfQtyInToPrice=req.body.sumOfQtyInToPrice;
            liveDataAdmin.Bids=req.body.bids;
            liveDataAdmin.Asks=req.body.asks;
            liveDataAdmin.LastTradedPrice=req.body.lastTradedPrice;
            liveDataAdmin.LastTradedQunatity=req.body.lastTradedQunatity;
            liveDataAdmin.TotalBuyQuantity=req.body.totalBuyQuantity;
            liveDataAdmin.TotalSellQuantity=req.body.totalSellQuantity;
            liveDataAdmin.TotalTradedQuantity=req.body.totalTradedQuantity;
            liveDataAdmin.AverageTradedPrice=req.body.averageTradedPrice;
            liveDataAdmin.LastTradedTime=req.body.lastTradedTime;
            liveDataAdmin.LastUpdateTime=req.body.lastUpdateTime;
            liveDataAdmin.PercentChangeMDE=req.body.percentChangeMDE;
            liveDataAdmin.Open=req.body.open;
            liveDataAdmin.High=req.body.high;
            liveDataAdmin.Low=req.body.low;
            liveDataAdmin.Close=req.body.close;
            liveDataAdmin.TotalValueTraded=req.body.totalValueTraded;
            liveDataAdmin.BuyBackTotalBuy=req.body.buyBackTotalBuy;
            liveDataAdmin.BuyBackTotalSell=req.body.buyBackTotalSell;
            liveDataAdmin.Result=req.body.result;
        await liveDataAdmin.save();
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
        mongoose.connection.db.listCollections({name: 'livedataadmins'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('livedataadmins', function(err, result) {
                    res.json({
                        success:true,
                        status_code:  201,
                        message:"Live Data Admin Collection Dropped !"
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



//  for each current day-active token, we have to fetch all live data between 9:15 am to 3:30 pm everyday
const startLiveAdminDataSaveIntoMongodb=async()=>{

    let masterAdminDataStatusTrue = await MasterAdmin.find({Status:true});
    let eventSetting = await EventSetting.find();
    await callMasterAPI(masterAdminDataStatusTrue,eventSetting[0].eventCode);
};

var cornTimestamp="00 15 9 * * 0-6"; //9:15 am
var job1 = new CronJob(cornTimestamp, function() {
    startLiveAdminDataSaveIntoMongodb();
}, null, true, 'Asia/Kolkata');
job1.start();

//manual testing
router.get("/startliveAdminDataSaveIntoMongodb",verifyToken, async(req,res)=>{
    try
    {
        let masterAdminDataStatusTrue = await MasterAdmin.find({Status:true});
        let eventSetting = await EventSetting.find();
        await callMasterAPI(masterAdminDataStatusTrue,eventSetting[0].eventCode);

        res.json({
            success: true,
            status_code:  201,
            message: "live Admin Data Save Into Mongodb started!!"
          });
    }
    catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

router.get("/stopliveAdminDataSaveIntoMongodb",verifyToken, async(req,res)=>{
    try
    {
        await stopLiveAdminDataSaveIntoMongodb();
        res.json({
            success: true,
            status_code:  201,
            message: "live Admin Data Save Into Mongodb stopped!!"
          });
    }
    catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});




// Each day at 5 pm all the live data migrate from MongoDB cloud to google drive in CSV format

const { Parser } = require('json2csv');
const Mdp = require("../models/Mdp");
const Cde = require("../models/Cde");
const Ide = require("../models/Ide");
const Oie = require("../models/Oie");
const Tle = require("../models/Tle");
const fs = require('fs');

const fieldsMDP1 =['_id','Bids','Asks','Touchline','MessageCode','MessageVersion','ApplicationType','TokenID','ExchangeSegment','ExchangeInstrumentID','ExchangeTimeStamp','BookType','XMarketType','SequenceNumber','updatedAt','createdAt','__v'];
const opts1 = { fieldsMDP1 };
const fieldsCDE2 =['_id','ApplicationType','BarTime','BarVolume','Close','ExchangeInstrumentID','ExchangeSegment','High','Low','MessageCode','MessageVersion','Open','OpenInterest','SumOfQtyInToPrice','TokenID','updatedAt','createdAt','__v'];
const opts2 = { fieldsCDE2 };
const fieldsIDE3 =['_id','MessageCode','MessageVersion','ApplicationType','TokenID','ExchangeSegment','ExchangeInstrumentID','ExchangeTimeStamp','IndexName','IndexValue','OpeningIndex','ClosingIndex','HighIndexValue','LowIndexValue','PercentChange','YearlyHigh','YearlyLow','NoOfUpmoves','NoOfDownmoves','MarketCapitalisation','SequenceNumber','updatedAt','createdAt','__v'];
const opts3 = { fieldsIDE3 };
const fieldsOIE4 =['_id','MessageCode','MessageVersion','ApplicationType','TokenID','ExchangeSegment','ExchangeInstrumentID','ExchangeTimeStamp','XTSMarketType','OpenInterest','updatedAt','createdAt','__v'];
const opts4 = { fieldsOIE4 };
const fieldsTLE5 =['_id','MessageCode','ExchangeSegment','ExchangeInstrumentID','ExchangeTimeStamp','LastTradedPrice','LastTradedQunatity','TotalBuyQuantity','TotalSellQuantity','TotalTradedQuantity','AverageTradedPrice','LastTradedTime','LastUpdateTime','PercentChange','Open','High','Low','Close','TotalValueTraded','BidInfo','AskInfo','updatedAt','createdAt','__v'];
const opts5 = { fieldsTLE5 };

const liveDataMigrateFromMongodbToGoogleDrive=async(collectionName)=>{
    await livedataMigrateFromMongodbToGoogleDrive(collectionName);
}

const convertLiveDataFromMongodbtoCSV=async()=>{
    try
    {
        let eventSetting = await EventSetting.find();
        var eventCode=eventSetting[0].eventCode;
        let result,collectionName,parser;
        if(eventCode==1502)
        {
            parser = new Parser(opts1);
            result = await Mdp.find({});
            collectionName="MDP";
        }
        else if(eventCode==1501)
        {
            parser = new Parser(opts5);
            result= await Tle.find({});
            collectionName="TLE";
        }
        else if(eventCode==1504)
        {
            parser = new Parser(opts3);
            result = await Ide.find({});
            collectionName="IDE";
        }
        else if(eventCode==1505)
        {
            parser = new Parser(opts2);
            result = await Cde.find({});
            collectionName="CDE";
        }
        else if(eventCode==1510)
        {
            parser = new Parser(opts4);
            result = await Oie.find({});
            collectionName="OIE";
        }
        else{
            console.log("sorry");
        }
        const csv = parser.parse(result);
        fs.writeFile('./utils/images/'+collectionName+'.csv', csv, function(err) {
            if (err) throw err;
            liveDataMigrateFromMongodbToGoogleDrive(collectionName);
            res.json({
                success: true,
                status_code:  201,
                data:ohlc,
                message:  collectionName+" file saved !"
            });
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
}

var cornTimestamp1='00 00 17 * * 0-6';
var job3 = new CronJob(cornTimestamp1, function() { // at 5:00 pm on everyday
    convertLiveDataFromMongodbtoCSV();
}, null, true, 'Asia/Kolkata');
job3.start();


// after every x days, we have to delete the saved live data(mdp,oie,ide,tle,ide) from MongoDB


const liveAdminDataDelete=async(collectionName)=>{
    mongoose.connection.db.listCollections({name: collectionName})
    .next(function(err, collinfo) {
        if (collinfo) {
            mongoose.connection.db.dropCollection(collectionName, function(err, result) {
                console.log(result);
            });
        }
    });
};

var CornDeleteDay = 6;
const CornDaySetting = require("../models/CornDaySetting");


const fetchCornDaySetting=async()=>{
    let cornDaySetting = await CornDaySetting.find();
    CornDeleteDay=cornDaySetting[0].CornDeleteDay;
}

var cornTimestamp7='00 50 16 * * 0-6';
var job7 = new CronJob(cornTimestamp7, function() { // at 4:50 pm on everyday
    fetchCornDaySetting();
}, null, true, 'Asia/Kolkata');
job7.start();

var cornTimestamp4=`00 00 17 * * ${CornDeleteDay}`;
var job4 = new CronJob(cornTimestamp4, function() { // at 5:00 pm on every sunday
    collectionName=['mdps','cdes','ides','oies','tle','livedataadmins'];
    for(var i=0;i<=collectionName.length;++i)
    {
        liveAdminDataDelete(collectionName[i]);
    }
}, null, true, 'Asia/Kolkata');
job4.start();


module.exports=router
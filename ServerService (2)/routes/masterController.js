const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const callMasterAPI = require("../utils/SoccetApiCaller.js");
const mongoose = require('mongoose');
const Master = require("../models/Master");
const Setting = require("../models/Setting");
var CronJob = require('cron').CronJob;

var exchangeSegmentList= ['NSECM','NSEFO'];
var seriesList = ['EQ','FUTSTK','FUTIDX','OPTIDX'];
var symbolList1 = [
    "ASIANPAINT",
    "AXISBANK",
    "BAJAJ-AUTO",
    "BAJFINANCE",
    "BAJAJFINSV",
    "BPCL",
    "BHARTIARTL",
    "BRITANNIA",
    "CIPLA",
    "COALINDIA",
    "DIVISLAB",
    "DRREDDY",
    "EICHERMOT",
    "GAIL",
    "GRASIM",
    "HCLTECH",
    "HDFCBANK",
    "HDFCLIFE",
    "HEROMOTOCO",
    "HINDALCO",
    "HINDUNILVR",
    "HDFC",
    "ICICIBANK",
    "ITC",
    "IOC",
    "INDUSINDBK",
    "INFY",
    "JSWSTEEL",
    "KOTAKBANK",
    "LT",
    "M&M",
    "MARUTI",
    "NTPC",
    "NESTLEIND",
    "ONGC",
    "POWERGRID",
    "RELIANCE",
    "SBILIFE",
    "SHREECEM",
    "SBIN",
    "SUNPHARMA",
    "TCS",
    "TATAMOTORS",
    "TATASTEEL",
    "TECHM",
    "TITAN",
    "UPL",
    "ULTRACEMCO",
    "WIPRO",
    "NIFTY BANK",
    "BANDHANBNK",
    "KOTAKBANK",
    "FEDERALBNK",
    "SBIN",
    "AXISBANK",
    "RBLBANK",
    "IDFCFIRSTB",
    "PNB",
    "HDFCBANK",
    "BANKBARODA",
    "ICICIBANK",
    "INDUSINDBK"
];

var symbolList2=['NIFTY','BANKNIFTY'];


const fetch_store_Data_from_XTSMASTERAPI=async()=>{
    mongoose.connection.db.listCollections({name: 'masters'})
    .next(function(err, collinfo) {
        if (collinfo) {
            mongoose.connection.db.dropCollection('masters', function(err, result) {
                console.log(result);
            });
        }
    });

    let settingDays= await Setting.find();
    var setDays=settingDays.days;
    await callMasterAPI(exchangeSegmentList,seriesList,symbolList1,symbolList2,setDays);
};



var job = new CronJob('00 50 08 * * 0-6', function() { // 8:50 am need to change
    fetch_store_Data_from_XTSMASTERAPI();
}, null, true, 'Asia/Kolkata');
job.start();


router.get("/storeData/:days",verifyToken, async(req,res)=>{
    try
    {
        mongoose.connection.db.listCollections({name: 'masters'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('masters', function(err, result) {
                    console.log(result);
                });
            }
        });

        var setDays=parseInt(req.params.days);

        await callMasterAPI(exchangeSegmentList,seriesList,symbolList1,symbolList2,setDays);

        res.json({
            success: true,
            status_code:  201,
            message: "Data saved from XTS server to our server successfully!"
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

router.get("/getData",verifyToken,async(req,res)=>{

    try{
        let masterAll = await Master.find();

        res.json({
            success:true,
            status_code:  201,
            data:masterAll,
            message:"Get all symbol data."
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


router.get("/deleteCollection",verifyToken,(req,res)=>{
    try{
        mongoose.connection.db.listCollections({name: 'masters'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('masters', function(err, result) {
                    res.json({
                        success:true,
                        status_code:  201,
                        message:"Master Collection Dropped !"
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
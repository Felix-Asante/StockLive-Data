const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const callMasterAPI = require("../utils/SoccetApiCaller2.js");
const mongoose = require('mongoose');
const MasterAdmin = require("../models/MasterAdmin");
const SettingAdmin = require("../models/SettingAdmin");
var CronJob = require('cron').CronJob;


const fetch_store_Data_from_XTSMASTERAPI=async()=>{
    mongoose.connection.db.listCollections({name: 'masters'})
    .next(function(err, collinfo) {
        if (collinfo) {
            mongoose.connection.db.dropCollection('masters', function(err, result) {
                console.log(result);
            });
        }
    });

    let settingAdmin= await SettingAdmin.find();
    await callMasterAPI(settingAdmin);
};


var job = new CronJob('00 40 08 * * 0-6', function() { // 8:40 am need to change
    fetch_store_Data_from_XTSMASTERAPI();
}, null, true, 'Asia/Kolkata');
job.start();


router.get("/storeMasterData",verifyToken, async(req,res)=>{
    try
    {
        mongoose.connection.db.listCollections({name: 'masteradmins'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('masteradmins', function(err, result) {
                    console.log(result);
                });
            }
        });

        let settingAdmin= await SettingAdmin.find();
        await callMasterAPI(settingAdmin);

        res.json({
            success: true,
            status_code:  201,
            message: "Master Data saved from XTS server to our server successfully!"
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

router.get("/getAllMasterAdminData",verifyToken,async(req,res)=>{

    try{
        let masterAdminData = await MasterAdmin.find();

        res.json({
            success:true,
            status_code:  201,
            data:masterAdminData,
            message:"Get all master admin added symbol data."
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

router.get("/getAllMasterAdminDataWhereStatusTrue",verifyToken,async(req,res)=>{

    try{
        let masterAdminData = await MasterAdmin.find({Status:true});

        res.json({
            success:true,
            status_code:  201,
            data:masterAdminData,
            message:"Get all master admin added symbol data where status true"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

router.put("/setStatusOfToken",verifyToken,async(req,res)=>{
    try
    {
        var tokenList = req.body.tokenList;
        for(var i=0;i<tokenList.length;++i){
            let masterAdmin = await MasterAdmin.findOne({ExchangeInstrumentID:tokenList[i]});
            masterAdmin.Status=true;
            await masterAdmin.save();
        }
        res.json({
            success: true,
            status_code:  201,
            message: "Master Admin token status changed successfully!!"
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


router.get("/deleteMasterAdminCollection",verifyToken,(req,res)=>{
    try{
        mongoose.connection.db.listCollections({name: 'masteradmins'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('masteradmins', function(err, result) {
                    res.json({
                        success:true,
                        status_code:  201,
                        message:"MasterAdmin Collection Dropped !"
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
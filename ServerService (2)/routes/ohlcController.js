const callMasterAPI1 = require("../utils/CallOHLCAPI.js");
const OHLCSetting = require("../models/OHLCSetting");
const verifyToken = require("../middlewares/Verify-token");

const { Parser } = require('json2csv');
const OHLC = require("../models/OHLC");
const fs = require('fs');
const router= require("express").Router();
const start = require("../utils/google2.js");
const fields =['_id','exchangeSegment','exchangeInstrumentID','dataReponse','updatedAt','createdAt','__v'];
const opts = { fields };
router.get("/convertOHLCtoCSV",verifyToken,async (req, res) => {
    try
    {
        const parser = new Parser(opts);
        let ohlc = await OHLC.find({});
        const csv = parser.parse(ohlc);
        fs.writeFile('./utils/images/OHLCData.csv', csv, function(err) {
            if (err) throw err;
            res.json({
                success: true,
                status_code:  201,
                data:ohlc,
                message: "file saved !"
            });
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


//Save OHLC Data into MongoDB.
router.get("/saveOHLCData",verifyToken,async(req,res)=>{
    try{
        let ohlcSetting= await OHLCSetting.find();
        console.log(ohlcSetting.length);
        for(var i=0;i<ohlcSetting.length;++i)
        {
            await callMasterAPI1(ohlcSetting[i]);
        }
        res.json({
            success: true,
            status_code:  201,
            message: "ohlc data save into Mongodb started!!"
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
const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const OHLCSetting = require("../models/OHLCSetting");

router.post("/addOHLCSetting",verifyToken, async(req, res) => {
    try
    {
        // Programming tools
        //Math.round(new Date().getTime()/1000);
       //online tool Epoch & Unix Timestamp Conversion Tools
       // https://www.epochconverter.com/#:~:text=Convert%20from%20human%2Dreadable%20date%20to%20epoch&text=long%20epoch%20%3D%20new%20java.text,remove%20'%2F1000'%20for%20milliseconds.&text=date%20%2B%25s%20%2Dd%22Jan,input%20in%20GMT%2FUTC%20time.
        let ohlcSetting = new OHLCSetting();
            ohlcSetting.userId=req.decoded._id;
            ohlcSetting.exchangeSegment=req.body.exchangeSegment;
            ohlcSetting.exchangeInstrumentID=req.body.exchangeInstrumentID;
            ohlcSetting.startTime=req.body.startTime;
            ohlcSetting.endTime=req.body.endTime;
            ohlcSetting.compressionValue=req.body.compressionValue;
            await ohlcSetting.save();
        res.json({
            success: true,
            status_code:  201,
            message: "Add ohlc setting successfully !"
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

router.put("/updateOHLCSetting",verifyToken, async(req, res) => {
    try
    {
        let ohlcSetting = await OHLCSetting.findOne({_id: req.body.Id });
            ohlcSetting.exchangeSegment=req.body.exchangeSegment;
            ohlcSetting.exchangeInstrumentID=req.body.exchangeInstrumentID;
            ohlcSetting.startTime=req.body.startTime;
            ohlcSetting.endTime=req.body.endTime;
            ohlcSetting.compressionValue=req.body.compressionValue;
            await ohlcSetting.save();
        res.json({
            success: true,
            status_code:  201,
            message: "update ohlc setting successfully !"
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

module.exports=router
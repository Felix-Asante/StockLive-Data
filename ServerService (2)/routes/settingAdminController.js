const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const SettingAdmin = require("../models/SettingAdmin");

router.post("/masterSettings",verifyToken,async (req, res) => {
    try
    {
        let settingAdmin = new SettingAdmin();
        settingAdmin.adminId = req.decoded._id;
        settingAdmin.exchangeSegment = req.body.ExchangeSegment;
        settingAdmin.symbolNames = req.body.SymbolNames;
        settingAdmin.series =  req.body.Series;
        settingAdmin.days=req.body.Days;
        let resp = await settingAdmin.save();
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Master setting set successfully !"
            });
        }
        else{
            res.json({
                success: true,
                status_code:  403,
                message: "Some error occured! Try again"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


router.put("/updateMasterSettings",verifyToken,async (req, res) => {
    try
    {
        let resp = await SettingAdmin.findOneAndUpdate({adminId: req.decoded._id},{
            exchangeSegment:req.body.ExchangeSegment,
            symbolNames:req.body.SymbolNames,
            series:req.body.Series,
            days:req.body.Days
        });
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Master setting update successfully !"
            });
        }
        else{
            res.json({
                success: true,
                status_code:  403,
                message: "Some error occured! Try again"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


module.exports=router
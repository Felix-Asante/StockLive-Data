const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const CornDaySetting = require("../models/CornDaySetting");

router.post("/cornDaySettings",verifyToken,async (req, res) => {
    try
    {
        let cornDaySetting = new CornDaySetting();
        cornDaySetting.adminId=req.decoded._id;
        cornDaySetting.CornDeleteDay = req.body.CornDeleteDay;
        let resp = await cornDaySetting.save();
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Corn day setting set successfully !"
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


router.put("/updateCornDaySettings",verifyToken,async (req, res) => {
    try
    {
        let resp = await CornDaySetting.findOneAndUpdate({adminId: req.decoded._id},{
            CornDeleteDay:req.body.CornDeleteDay,
        });
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Corn day setting update successfully !"
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
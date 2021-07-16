const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const EventSetting = require("../models/EventSetting");

router.post("/eventSettings",verifyToken,async (req, res) => {
    try
    {
        let eventSetting = new EventSetting();
        eventSetting.adminId=req.decoded._id;
        eventSetting.eventCode = req.body.EventCode;
        let resp = await eventSetting.save();
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Event Code setting set successfully !"
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


router.put("/updateEventSettings",verifyToken,async (req, res) => {
    try
    {
        let resp = await EventSetting.findOneAndUpdate({adminId: req.decoded._id},{
            eventCode:req.body.EventCode,
        });
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Event Code setting update successfully !"
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
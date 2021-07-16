const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const Setting = require("../models/Setting");

router.post("/addDays",verifyToken,async (req, res) => {
    try
    {
        let setting = new Setting();
        setting.userId = req.decoded._id
        setting.days=req.body.Days;
        let resp = await setting.save();
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "User set days successfully !"
            });
        }
        else{
            res.json({
                success: true,
                status_code:  403,
                message: "User not able to set days !"
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

router.put("/updateDays/:id",verifyToken,async (req, res) => {
    try
    {
        await Setting.findOneAndUpdate({_id: req.params.id},{days:req.body.Days});
        res.json({
            success: true,
            status_code:  201,
            message: "User days update successfully !"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});




module.exports=router
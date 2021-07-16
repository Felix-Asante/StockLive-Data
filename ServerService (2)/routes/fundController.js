const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const User = require("../models/User");

router.put("/updateFund",verifyToken, async(req, res) => {
    try
    {
        let user = await User.findOne({_id: req.decoded._id });
            var temp=user.credit;
            user.credit=parseInt(req.body.Credit)+temp;
        await user.save();
        res.json({
            success: true,
            status_code:  201,
            message: "Update fund successfully !"
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
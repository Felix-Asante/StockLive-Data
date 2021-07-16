const router= require("express").Router();
const Symbol = require("../models/Symbol");
const verifyToken = require("../middlewares/Verify-token");

router.post("/addSymbol",verifyToken,async (req, res) => {
    try
    {
        let symbol = new Symbol();
        symbol.Userid=req.decoded._id
        symbol.ExchangeSegment=req.body.exchangeSegment;
        symbol.ExchangeInstrumentID=req.body.exchangeInstrumentID;
        symbol.Description=req.body.description;
        symbol.Name=req.body.symbolName;
        symbol.Series=req.body.seriesName;
        let resp = await symbol.save();
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "User symbol locked !"
            });
        }
        else{
            res.json({
                success: true,
                status_code:  403,
                message: "User Symbol not locked !"
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

router.get("/getSymbol",verifyToken,async(req,res)=>{
    try{
        let symbol = await Symbol.find({Userid: req.decoded._id});
        res.json({
            success:true,
            status_code:  201,
            data: symbol,
            message: "Get all user added symbols !"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

router.delete("/deleteSymbol/:id",verifyToken,async(req, res) => {
    try
    {
        let resp=await Symbol.deleteOne({_id: req.params.id})
        if(resp){
            res.json({
                success: true,
                status_code:  201,
                message: "Successfully deleted user symbol !"
            });
        }
        else{
            res.json({
                success: true,
                status_code:  201,
                message: "User Symbol not deleted! Try again."
            });
        }
    }
    catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


module.exports=router
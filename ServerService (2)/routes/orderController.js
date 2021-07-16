const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const Order = require("../models/Order");
var CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
router.post("/placeOrder",verifyToken, async(req, res) => {
    try
    {
        let order = new Order();
            order.OrderUserid=req.decoded._id;
            order.OrderTimestamp=req.body.orderTimestamp;
            order.TransactionType=req.body.transactionType;
            order.ExchangeSegment=req.body.exchangeSegment;
            order.ExchangeInstrumentId=req.body.exchangeInstrumentId;
            order.SymbolName=req.body.symbolName;
            order.OrderQuantity=req.body.orderQuantity;
            order.OrderType=req.body.orderType;
            order.ProductType=req.body.productType;
            order.OrderPrice=req.body.orderPrice;
            order.TriggerPrice=req.body.triggerPrice;
            order.DisclosedQuantity=req.body.disclosedQuantity;
            order.Duration=req.body.duration;
            order.Status="Open";
        await order.save();
        res.json({
            success: true,
            status_code:  201,
            message: "Order placed successfully "
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

router.get("/getOpenOrder",verifyToken,async(req,res)=>{
    try{
        let order = await Order.find({
            OrderUserid:req.decoded._id,
            Status: 'Open'
        });
        res.json({
            success:true,
            status_code:  201,
            data: order,
            numofdata:order.length,
            message: "Get all open order !"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

router.get("/getExecutedOrder",verifyToken,async(req,res)=>{
    try{
        let order = await Order.find({
            OrderUserid:req.decoded._id,
            Status: {$in: ['Completed', 'Rejected','Cancel']} //mongoose query same field with different values
        });
        res.json({
            success:true,
            status_code:  201,
            data: order,
            numofdata:order.length,
            message: "Get all completed order !"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});

router.put("/modifyOrder/:id",verifyToken, async(req, res) => {
    try
    {
        let updateOrder = await Order.findOne({_id: req.params.id});
            updateOrder.OrderUserid=req.decoded._id;
            updateOrder.OrderTimestamp=req.body.orderTimestamp;
            updateOrder.TransactionType=req.body.transactionType;
            updateOrder.ProductType=req.body.productType;
            updateOrder.OrderQuantity=req.body.orderQuantity;
            updateOrder.OrderType=req.body.orderType;
            updateOrder.OrderPrice=req.body.orderPrice;
            updateOrder.TriggerPrice=req.body.triggerPrice;
            updateOrder.DisclosedQuantity=req.body.disclosedQuantity;
            updateOrder.Status="Open";
        await updateOrder.save();
        res.json({
            success: true,
            status_code:  201,
            message: "Placed order modified successfully !"
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



router.put("/cancelOrder/:id",verifyToken, async(req, res) => {
    try
    {
        let cancelOrder = await Order.findOne({_id: req.params.id});
            cancelOrder.OrderUserid=req.decoded._id;
            cancelOrder.Status="Cancel";
        await cancelOrder.save();
        res.json({
            success: true,
            status_code:  201,
            message: "Placed order cancel successfully !"
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

router.patch("/cancelOrder",verifyToken, async(req, res) => {
    try
    {
        await Order.updateMany({_id:{$in:req.body.idList}},{$set:{Status:'Cancel'}}).then(
            resp=>{
                res.json({
                    success: true,
                    status_code:  201,
                    message: "all open order cancel successfully !"
                });
            }
        ).catch(err=>{
            console.log(err);
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

const find_all_open_order_and_close_it=async()=>{
    await Order.updateMany({Status: 'Open'},{Status: 'Cancel'}, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Cancel all open orders.");
        }
    })
};

const drop_orders_collection=()=>{
    mongoose.connection.db.listCollections({name: 'orders'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('orders', function(err, result) {
                   console.log("Order Collection Dropped !");
                });
            }
        });
}

var job3 = new CronJob('00 20 15 * * 0-6', function() { // 3:20pm
    find_all_open_order_and_close_it();
}, null, true, 'Asia/Kolkata');
job3.start();

var job4 = new CronJob('00 00 00 * * 0-6', function() { // 12 am
    drop_orders_collection();
}, null, true, 'Asia/Kolkata');
job4.start();

module.exports=router
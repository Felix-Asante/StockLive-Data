const router= require("express").Router();
const verifyToken = require("../middlewares/Verify-token");
const Trade = require("../models/Trade");
const Order = require("../models/Order");
const User = require("../models/User");
const Position = require("../models/Position");
var CronJob = require('cron').CronJob;
const mongoose = require('mongoose');

//request
// [
//     {
//       "exchange": "NSE_EQ",
//       "token": 2885,
//       "symbol": "RELIANCE",
//       "product": "I",
//       "order_type": "M",
//       "transaction_type": "B",
//       "traded_quantity": 1,
//       "exchange_order_id": "1200000003336976",
//       "order_id": "170515000047270",
//       "exchange_time": "15-May-2017 13:56:31",
//       "time_in_micro": "1494836825761723",
//       "traded_price": 0,
//       "trade_id": "51345784",
//     }
//   ]

const addOperation=(iQ,iP,fQ,fP)=>{
    return [(iQ+fQ).toFixed(2),(iP+fP).toFixed(2)];
}

const subOperation=(iQ,iP,fQ,fP)=>{
    return [(iQ-fQ).toFixed(2),(iP-fP).toFixed(2)];
}

const addCredit=(iA,fA)=>{
    return iA+fA;
}
const subCredit=(iA,fA)=>{
    return iA-fA;
}

router.post("/placeTrade",verifyToken, async(req, res) => {
    try
    {
        let trade = new Trade();
            trade.OrderId=req.body.orderId;
            trade.ExchangeTime=req.body.exchangeTime;
            trade.TradeQuantity=req.body.tradeQuantity;
            trade.TradePrice=req.body.tradePrice;
            trade.UserId=req.decoded._id;
        let updatedTrades=await trade.save()
        if(updatedTrades)
        {
            let updateOrder = await Order.findOne({_id:req.body.orderId});
            // updateOrder.OrderQuantity=req.body.orderQuantity;
            // updateOrder.OrderPrice=req.body.orderPrice;
            updateOrder.Status="Completed";
            let updatedOrder=await updateOrder.save();
            if(updatedOrder)
            {

                let foundUser= await User.findOne({_id:req.decoded._id});
                if(foundUser){
                    if(updatedOrder.TransactionType==="Sell"){
                        foundUser.credit=addCredit(foundUser.credit,updatedTrades.TradePrice);
                        await foundUser.save();
                    }
                    else{
                        foundUser.credit=subCredit(foundUser.credit,updatedTrades.TradePrice);
                        await foundUser.save();
                    }
                }

                let foundPosition = await Position.findOne({ExchangeInstrumentId:updatedOrder.ExchangeInstrumentId});
                if(foundPosition){
                    if(foundPosition.TransactionType===updatedOrder.TransactionType){
                        var result=addOperation(foundPosition.PositionQuantity,foundPosition.PositionPrice,updatedTrades.TradeQuantity,updatedTrades.TradePrice)
                        foundPosition.PositionQuantity=result[0];
                        foundPosition.PositionPrice=result[1];
                        await foundPosition.save();
                    }
                    else{
                        var result=subOperation(foundPosition.PositionQuantity,foundPosition.PositionPrice,updatedTrades.TradeQuantity,updatedTrades.TradePrice)
                        foundPosition.PositionQuantity=result[0];
                        foundPosition.PositionPrice=result[1];
                        await foundPosition.save();
                    }
                }
                else{
                    let position = new Position();
                    position.OrderUserid=req.decoded._id;
                    position.ProductType=updatedOrder.ProductType;
                    position.ExchangeSegment=updatedOrder.ExchangeSegment;
                    position.ExchangeInstrumentId=updatedOrder.ExchangeInstrumentId;
                    position.SymbolName=updatedOrder.SymbolName;
                    position.TransactionType=updatedOrder.TransactionType; //Buy
                    position.PositionQuantity=updatedTrades.TradeQuantity;
                    position.PositionPrice=updatedTrades.TradePrice;
                    await position.save();
                }
            }
            // else{
            //     res.json({
            //         success: true,
            //         status_code:  203,
            //         message: "Executed Order not updated successfully!!"
            //     });
            // }
            res.json({
                success: true,
                status_code:  201,
                message: "Trade placed successfully "
            });
        }
    }
    catch (err) {
        res.status(500).json({
        success: false,
        status_code: 500,
        message: err.message
        });
    }
});

router.get("/getCompletedTrade",verifyToken,async(req,res)=>{
    try{
        let trade = await Trade.find({
            UserId:req.decoded._id
        });
        res.json({
            success:true,
            status_code:  201,
            data: trade,
            numofdata:trade.length,
            message: "Get all completed trades !"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            status_code: 500,
            message: err.message
        });
    }
});


//resp


// {
//     "LoginID": "XTS",
//     "ClientID": "XTSCLI",
//     "AppOrderID": 648468731,
//     "OrderReferenceID": "",
//     "GeneratedBy": "WebAPI",
//     "ExchangeOrderID": "1005239196374109",
//     "OrderCategoryType": "NORMAL",
//     "ExchangeSegment": "NSECM",
//     "ExchangeInstrumentID": 16921,
//     "OrderSide": "Buy",
//     "OrderType": "Limit",
//     "ProductType": "NRML",
//     "TimeInForce": "DAY",
//     "OrderPrice": 0,
//     "OrderQuantity": 1,
//     "OrderStopPrice": 0,
//     "OrderStatus": "Filled",
//     "OrderAverageTradedPrice": "44.00",
//     "LeavesQuantity": 0,
//     "CumulativeQuantity": 1,
//     "OrderDisclosedQuantity": 0,
//     "OrderGeneratedDateTime": "2019-03-09T14:31:50.8001874",
//     "ExchangeTransactTime": "2019-03-09T14:31:51+05:30",
//     "LastUpdateDateTime": "2019-03-09T14:31:51.5176637",
//     "CancelRejectReason": "",
//     "OrderUniqueIdentifier": "454845",
//     "OrderLegStatus": "SingleOrderLeg",
//     "LastTradedPrice": 44,
//     "LastTradedQuantity": 1,
//     "LastExecutionTransactTime": "2019-03-09T14:31:51",
//     "ExecutionID": "1320599196383056",
//     "ExecutionReportIndex": 3,
//     "MessageCode": 9005,
//     "MessageVersion": 1,
//     "TokenID": 0,
//     "ApplicationType": 0
//    } 

const drop_trade_collection=()=>{
    mongoose.connection.db.listCollections({name: 'trades'})
        .next(function(err, collinfo) {
            if (collinfo) {
                mongoose.connection.db.dropCollection('trades', function(err, result) {
                   console.log("Trade Collection Dropped !");
                });
            }
        });
}

var job45 = new CronJob('00 00 00 * * 0-6', function() { // 12 am
    drop_trade_collection();
}, null, true, 'Asia/Kolkata');
job45.start();

module.exports=router
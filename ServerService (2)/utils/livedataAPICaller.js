const LiveDataAdmin = require("../models/LiveDataAdmin");
const Mdp = require("../models/Mdp");
const Cde = require("../models/Cde");
const Ide = require("../models/Ide");
const Oie = require("../models/Oie");
const Tle = require("../models/Tle");

var CronJob = require('cron').CronJob;

//Accessing the XtsMarketDataAPI and XtsMarketDataWS from xts-marketdata-api library
var XtsMarketDataAPI = require('xts-marketdata-api').xtsMarketDataAPI;
var XtsMarketDataWS = require('xts-marketdata-api').WS;


let secretKey = process.env.XTSSecretKey;//config.secretKey;
let appKey = process.env.XTSAppKey;//config.appKey;
let source = process.env.XTSSource;//config.source;
let url = process.env.XTSUrl;//config.url;
let userID = null;
let isTradeSymbol = false;

//xtsInteractive for API calls and xtsMarketDataWS for events related functionality
var xtsMarketDataAPI = null;
var xtsMarketDataWS = null;

const callMasterAPI= async (settingLiveData,eventCode) => {
  //creating the instance of XTSRest
  xtsMarketDataAPI = new XtsMarketDataAPI(url);

  //calling the logIn API
  var loginRequest = {
    secretKey,
    appKey,
  };

  let logIn = await xtsMarketDataAPI.logIn(loginRequest);

  // checking for valid loginRequest
  if (logIn && logIn.type == xtsMarketDataAPI.responseTypes.success) {
    //creating the instance of xtsMarketDataWS
    userID = logIn.result.userID;
    xtsMarketDataWS = new XtsMarketDataWS(url);

    //Instantiating the socket instance
    var socketInitRequest = {
      userID: logIn.result.userID,
      publishFormat: 'JSON',
      broadcastMode: 'Full',
      token: logIn.result.token, // Token Generated after successful LogIn
    };
    xtsMarketDataWS.init(socketInitRequest);

    //Registering the socket Events
    await registerEvents(eventCode);

    fetch_live_data_based_on_token(settingLiveData,eventCode);
  } else {
    console.error(logIn);
  }
};

async function fetch_live_data_based_on_token(settingLiveData,eventCode) {
    // 1501: Touchline
    // 1502: Market Data
    // 1504: Index Data
    // 1505: Candle Data
    // 1510: OpenInterest

    var instrumentsData=[];
    for (var i=0;i<settingLiveData.length;++i)
    {
      if(settingLiveData[i].ExchangeSegment=="NSECM"){
        instrumentsData.push({"exchangeSegment":1,"exchangeInstrumentID":settingLiveData[i].ExchangeInstrumentID});
      }
      else if(settingLiveData[i].ExchangeSegment=="NSEFO"){
        instrumentsData.push({"exchangeSegment":2,"exchangeInstrumentID":settingLiveData[i].ExchangeInstrumentID});
      }
      else if(settingLiveData[i].ExchangeSegment=="BSECM"){
        instrumentsData.push({"exchangeSegment":11,"exchangeInstrumentID":settingLiveData[i].ExchangeInstrumentID});
      }
      else{
        console.log("Sorry!");
      }
    }

    // var instrumentsData=[{
    //   exchangeSegment:1,
    //   exchangeInstrumentID:236
    // }]

//     NSECM: 1
// NSEFO: 2
// BSECM: 11

    let subscriptionRequest = {
      instruments: instrumentsData,
      xtsMessageCode: eventCode,//1502
    };

    // subscribe instrument to get market data
  await subscription(subscriptionRequest);

    let getQuotesRequest = {
      isTradeSymbol: isTradeSymbol,
      instruments: instrumentsData,
      xtsMessageCode: eventCode,
      publishFormat: 'JSON',
    };

    // get details of instrument
  await getQuotes(getQuotesRequest);

  //await logOut();
}


var subscription = async function (subscriptionRequest) {
  let response = await xtsMarketDataAPI.subscription(subscriptionRequest);
  console.log(response);
  return response;
};

var getQuotes = async function (getQuotesRequest) {
  let response = await xtsMarketDataAPI.getQuotes(getQuotesRequest);
  // console.log("FinalData");
  // console.log(response.result.quotesList);
  console.log(response.result.listQuotes);
  // for(var i=0;i<response.result.listQuotes.length;++i)
  // {
  //   console.log(JSON.parse(response.result.listQuotes[i]));
  //   saveDataintoMongodb(JSON.parse(response.result.listQuotes[i]))
  // }
  return response;
};


const saveDataintoMongodb=async(data,eventCode)=>{
  // 1501: Touchline
    // 1502: Market Data
    // 1504: Index Data
    // 1505: Candle Data
    // 1510: OpenInterest
  if(eventCode==1502)
  {
    await new Mdp(data).save();
  }

  else if(eventCode==1501)
  {
    await new Tle(data).save();
  }

  else if(eventCode==1504)
  {
    await new Ide(data).save();
  }

  else if(eventCode==1505)
  {
    await new Cde(data).save();
  }

  else if(eventCode==1510)
  {
    await new Oie(data).save();
  }
  else{
    console.log("sorry");
  }
};


const stopLiveAdminDataSaveIntoMongodb=async()=>{
  await logOut();
}

var logOut = async function () {
  let response = await xtsMarketDataAPI.logOut();
  console.log(response);
  return response;
};


  var registerEvents = async function (eventCode) {
    //instantiating the listeners for all event related data
    //"connect" event listener
    xtsMarketDataWS.onConnect((connectData) => {
      console.log(connectData);
    });

    //"joined" event listener
    xtsMarketDataWS.onJoined((joinedData) => {
      console.log(joinedData);
    });

    //"error" event listener
    xtsMarketDataWS.onError((errorData) => {
      console.log(errorData);
    });

    //"disconnect" event listener
    xtsMarketDataWS.onDisconnect((disconnectData) => {
      console.log(disconnectData);
    });

     //"marketDepthEvent" event listener
     xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
      console.log("Final");
      // console.log(marketDepthData);
      saveDataintoMongodb(marketDepthData,eventCode);
    });
  
    //"openInterestEvent" event listener
    xtsMarketDataWS.onOpenInterestEvent((openInterestData) => {
      console.log(openInterestData);
      saveDataintoMongodb(openInterestData,eventCode);
    });
  
    //"indexDataEvent" event listener
    xtsMarketDataWS.onIndexDataEvent((indexData) => {
      console.log(indexData);
      saveDataintoMongodb(indexData,eventCode);
    });
  
    //"marketDepth100Event" event listener
    xtsMarketDataWS.onMarketDepth100Event((marketDepth100Data) => {
      console.log(marketDepth100Data);
    });
  
    // //"instrumentPropertyChangeEvent" event listener
    // xtsMarketDataWS.onInstrumentPropertyChangeEvent((propertyChangeData) => {
    //   console.log(propertyChangeData);
    // });
  
    //"candleDataEvent" event listener
    xtsMarketDataWS.onCandleDataEvent((candleData) => {
      console.log(candleData);
      saveDataintoMongodb(candleData,eventCode);
    });

    xtsMarketDataWS.onLogout((logoutData) => {
      console.log(logoutData);
    });
  };


//stopLiveAdminDataSaveIntoMongodb

var cornTimestamp="00 30 15 * * 0-6"; //3:30
var job2 = new CronJob(cornTimestamp,  function() {
  stopLiveAdminDataSaveIntoMongodb();
}, null, true, 'Asia/Kolkata');
job2.start();

module.exports = {callMasterAPI,stopLiveAdminDataSaveIntoMongodb};
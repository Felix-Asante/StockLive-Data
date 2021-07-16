const OHLC = require("../models/OHLC");
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

const callMasterAPI= async (settingData) => {
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
    await registerEvents();

    fetch_all_OHLC_Data(settingData);
  } else {
    console.error(logIn);
  }
};

async function fetch_all_OHLC_Data(settingData) {
    let getOHLCRequest = {
        exchangeSegment: settingData.exchangeSegment,
        exchangeInstrumentID: settingData.exchangeInstrumentID,
        startTime: settingData.startTime,
        endTime: settingData.endTime,
        compressionValue: settingData.compressionValue,
      };

      // get OHLC data
      await getOHLC(getOHLCRequest);

    await logOut();
}

var getOHLC = async function (getOHLCRequest) {
    let response = await xtsMarketDataAPI.getOHLC(getOHLCRequest);
    console.log(response);
    saveDataintoMongodb(response.result);
    return response;
  };

var logOut = async function () {
  let response = await xtsMarketDataAPI.logOut();
  console.log(response);
  return response;
};

const saveDataintoMongodb=async(data)=>{
    await new OHLC(data).save();
};


  var registerEvents = async function () {
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

    xtsMarketDataWS.onLogout((logoutData) => {
      console.log(logoutData);
    });
  };


module.exports = callMasterAPI;
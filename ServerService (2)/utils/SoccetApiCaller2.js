const MasterAdmin = require("../models/MasterAdmin");
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

    fetch_store_token_data(settingData);
  } else {
    console.error(logIn);
  }
};

async function fetch_store_token_data(SettingData1) {
    //console.log(settingData[0]);
    var settingData=SettingData1[0];
    let instrumentMasterRequest = {
      exchangeSegmentList: [settingData.exchangeSegment],
    };
    await instrumentMaster(instrumentMasterRequest,settingData);
    await logOut();
}

  var logOut = async function () {
    let response = await xtsMarketDataAPI.logOut();
    console.log(response);
    return response;
  };

  const saveDataintoMongodb=async(a,b,c,d,e,f)=>{
    let masterAdmin = new MasterAdmin();
    masterAdmin.ExchangeSegment=a;
    masterAdmin.ExchangeInstrumentID=b;
    masterAdmin.Description=d;
    masterAdmin.Name=c;
    masterAdmin.Series=e;
    masterAdmin.Timestamp=f;
    await masterAdmin.save();
  };

  const compareDate2 = (inputDate, dt1, dt) => {
    var di = new Date(inputDate);
  
    if (di.getTime() >= dt1.getTime() && di.getTime() <= dt.getTime()) {
      return true;
    } else {
      return false;
    }
  };

  var instrumentMaster = async function (instrumentMasterRequest,settingData) {
    let response = await xtsMarketDataAPI.instrumentMaster(
      instrumentMasterRequest
    );
    var finalResult=[];
    var result=response.result.split("\n");
    for(var i=0;i<result.length;++i){
        var result1=result[i].split("|");
          if(settingData.series.includes(result1[5])){
            finalResult.push(result[i]);
          }
    }

    console.log(finalResult);

    if(settingData.days==0)
    {
        for(var i=0;i<finalResult.length;++i){
            var result2=finalResult[i].split("|");
            if(settingData.symbolNames.includes(result2[3])){
              saveDataintoMongodb(result2[0],result2[1],result2[3],result2[4],result2[5],result2[15]);
            }
          }
    }
    else
    {
        var dt1 = new Date(); //current date time
        var dt = new Date(); //current date time
        dt.setDate(dt.getDate()+parseInt(settingData.setDays));
        for(var i=0;i<finalResult.length;++i){
        var result2=finalResult[i].split("|");
            if(settingData.symbolNames.includes(result2[3]) && compareDate2(result2[16].split('T')[0],dt1,dt)){
            saveDataintoMongodb(result2[0],result2[1],result2[3],result2[4],result2[5],result2[16]);
            }
        }
    }
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
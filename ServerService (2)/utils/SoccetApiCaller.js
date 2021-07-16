const Master = require("../models/Master");
//Accessing the XtsMarketDataAPI and XtsMarketDataWS from xts-marketdata-api library
var XtsMarketDataAPI = require("xts-marketdata-api").xtsMarketDataAPI;
var XtsMarketDataWS = require("xts-marketdata-api").WS;

let secretKey = process.env.XTSSecretKey; //config.secretKey;
let appKey = process.env.XTSAppKey; //config.appKey;
let source = process.env.XTSSource; //config.source;
let url = process.env.XTSUrl; //config.url;
let userID = null;
let isTradeSymbol = false;

//xtsInteractive for API calls and xtsMarketDataWS for events related functionality
var xtsMarketDataAPI = null;
var xtsMarketDataWS = null;

const callMasterAPI = async (
  exchangeSegmentList,
  seriesList,
  symbolList1,
  symbolList2,
  setDays
) => {
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
      publishFormat: "JSON",
      broadcastMode: "Full",
      token: logIn.result.token, // Token Generated after successful LogIn
    };
    xtsMarketDataWS.init(socketInitRequest);

    //Registering the socket Events
    await registerEvents();

    fetch_store_NSECM_EQ_Data(
      exchangeSegmentList[0],
      seriesList[0],
      symbolList1
    );
    fetch_NSEFO_Data(
      exchangeSegmentList[1],
      seriesList,
      symbolList1,
      symbolList2,
      setDays
    );
  } else {
    console.error(logIn);
  }
};

async function fetch_store_NSECM_EQ_Data(a, series, symbolList1) {
  let instrumentMasterRequest = {
    exchangeSegmentList: [a],
  };
  await instrumentMaster(instrumentMasterRequest, series, symbolList1);
  // await logOut();
}

async function fetch_NSEFO_Data(
  a,
  seriesList,
  symbolList1,
  symbolList2,
  setDays
) {
  let instrumentMasterRequest = {
    exchangeSegmentList: [a],
  };
  await instrumentMaster1(
    instrumentMasterRequest,
    seriesList,
    symbolList1,
    symbolList2,
    setDays
  );
  await logOut();
}

var logOut = async function () {
  let response = await xtsMarketDataAPI.logOut();
  console.log(response);
  return response;
};

const saveDataintoMongodb = async (a, b, c, d, e, f) => {
  let master = new Master();
  master.ExchangeSegment = a;
  master.ExchangeInstrumentID = b;
  master.Description = d;
  master.Name = c;
  master.Series = e;
  master.Timestamp = f;
  await master.save();
};

var instrumentMaster = async function (
  instrumentMasterRequest,
  series,
  symbolList1
) {
  let response = await xtsMarketDataAPI.instrumentMaster(
    instrumentMasterRequest
  );
  var finalResult = [];
  var result = response.result.split("\n");
  for (var i = 0; i < result.length; ++i) {
    var result1 = result[i].split("|");
    if (result1[5] == series) {
      finalResult.push(result[i]);
    }
  }

  for (var i = 0; i < finalResult.length; ++i) {
    var result2 = finalResult[i].split("|");
    if (symbolList1.includes(result2[3])) {
      saveDataintoMongodb(
        result2[0],
        result2[1],
        result2[3],
        result2[4],
        result2[5],
        result2[15]
      );
    }
  }
};

var instrumentMaster1 = async function (
  instrumentMasterRequest,
  seriesList,
  symbolList1,
  symbolList2,
  setDays
) {
  let response = await xtsMarketDataAPI.instrumentMaster(
    instrumentMasterRequest
  );

  var result = response.result.split("\n");

  store_NSEFO_FUTSTK_Data(result, seriesList[1], symbolList1);
  store_NSEFO_FUTIDX_Data(result, seriesList[2], symbolList2);
  store_NSEFO_OPTIDX_Data(result, seriesList[3], symbolList2, setDays);
};

const compareDate1 = (inputDate, dt1, dt) => {
  var di = new Date(inputDate);

  if (di.getTime() >= dt1.getTime() && di.getTime() <= dt.getTime()) {
    return true;
  } else {
    return false;
  }
};

var store_NSEFO_FUTSTK_Data = (result, series, symbolList) => {
  var finalResult = [];
  for (var i = 0; i < result.length; ++i) {
    var result1 = result[i].split("|");
    if (result1[5] == series) {
      finalResult.push(result[i]);
    }
  }
  var dt1 = new Date();
  var dt = new Date();
  dt.setMonth(dt.getMonth() + 1);
  for (var i = 0; i < finalResult.length; ++i) {
    var result2 = finalResult[i].split("|");
    if (
      symbolList.includes(result2[3]) &&
      compareDate1(result2[16].split("T")[0], dt1, dt)
    ) {
      saveDataintoMongodb(
        result2[0],
        result2[1],
        result2[3],
        result2[4],
        result2[5],
        result2[16]
      );
    }
  }
};



var store_NSEFO_FUTIDX_Data = (result, series, symbolList) => {
  var finalResult = [];
  for (var i = 0; i < result.length; ++i) {
    var result1 = result[i].split("|");
    if (result1[5] == series) {
      finalResult.push(result[i]);
    }
  }
  var dt1 = new Date(); //current date
  var dt = new Date(); // 1 month from now date
  dt.setMonth(dt.getMonth() + 1);
  for (var i = 0; i < finalResult.length; ++i) {
    var result2 = finalResult[i].split("|");
    if (
      symbolList.includes(result2[3]) &&
      compareDate1(result2[16].split("T")[0], dt1, dt)
    ) {
      saveDataintoMongodb(
        result2[0],
        result2[1],
        result2[3],
        result2[4],
        result2[5],
        result2[16]
      );
      console.log(result2);
    }
  }
};

const compareDate2 = (inputDate, dt1, dt) => {
  var di = new Date(inputDate);

  if (di.getTime() >= dt1.getTime() && di.getTime() <= dt.getTime()) {
    return true;
  } else {
    return false;
  }
};

var store_NSEFO_OPTIDX_Data = (result, series, symbolList, setDays) => {
  var finalResult = [];
  for (var i = 0; i < result.length; ++i) {
    var result1 = result[i].split("|");
    if (result1[5] == series) {
      finalResult.push(result[i]);
    }
  }

  var dt1 = new Date(); //current date time
  var dt = new Date(); //current date time
  dt.setDate(dt.getDate()+parseInt(setDays));// 14 days added

  for (var i = 0; i < finalResult.length; ++i) {
    var result2 = finalResult[i].split("|");
    if (
      symbolList.includes(result2[3]) &&
      compareDate2(result2[16].split("T")[0],dt1,dt)
    ) {
      saveDataintoMongodb(
        result2[0],
        result2[1],
        result2[3],
        result2[4],
        result2[5],
        result2[16]
      );
      console.log(result2);
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

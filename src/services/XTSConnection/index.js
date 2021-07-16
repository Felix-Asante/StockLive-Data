let XtsMarketDataAPI = require("xts-marketdata-api").XtsMarketDataAPI;
let XtsMarketDataWS = require("xts-marketdata-api").WS;

const xtsUrl = process.env.REACT_APP_XTS_URL;
const xtsSecretKey = process.env.REACT_APP_XTS_SECRETKEY;
const xtsAppKey = process.env.REACT_APP_XTS_APPKEY;
const xtsWebSource = process.env.REACT_APP_XTS_SOURCE;
let xtsMarketDataAPI = null;
let xtsMarketDataWS = null;

export default class DataFeed {
  async callMasterAPI(settingLiveData) {
    //XTS API Login Request
    xtsMarketDataAPI = new XtsMarketDataAPI(xtsUrl);
    let loginRequest = {
      secretKey: xtsSecretKey,
      appKey: xtsAppKey,
      source: xtsWebSource,
    };
    let logIn = await xtsMarketDataAPI.logIn(loginRequest);

    if (logIn && logIn.type === xtsMarketDataAPI.responseTypes.success) {
      let userID = logIn?.result?.userID;

      //XTS WebSocket Connection Request
      xtsMarketDataWS = new XtsMarketDataWS(xtsUrl);
      const socketInitRequest = {
        userID: userID,
        publishFormat: "JSON",
        broadcastMode: "Full",
        token: logIn?.result?.token, // Token Generated after successful LogIn
      };
      xtsMarketDataWS.init(socketInitRequest);

      //Subscription of each Instruments
      await this.subscribeInstrument(settingLiveData);
      //Fetch each MarketDepthData for each Instruments
      await this.registerEvents();
    } else {
      console.error(logIn, "Error in XTS Login");
    }
  }

  async subscribeInstrument(settingLiveData) {
    let instrumentsData = [];
    for (let i = 0; i < settingLiveData.length; ++i) {
      if (settingLiveData[i].ExchangeSegment === "NSECM") {
        instrumentsData.push({
          exchangeSegment: 1,
          exchangeInstrumentID: settingLiveData[i].ExchangeInstrumentID,
        });
      } else if (settingLiveData[i].ExchangeSegment === "NSEFO") {
        instrumentsData.push({
          exchangeSegment: 2,
          exchangeInstrumentID: settingLiveData[i].ExchangeInstrumentID,
        });
      } else if (settingLiveData[i].ExchangeSegment === "BSECM") {
        instrumentsData.push({
          exchangeSegment: 11,
          exchangeInstrumentID: settingLiveData[i].ExchangeInstrumentID,
        });
      } else {
        console.log("Sorry! Something went wrong!!!");
      }
    }

    //Subscription of each instruments
    let subscriptionRequest = {
      instruments: instrumentsData,
      xtsMessageCode: 1502, //1502: Market Data
    };
    await this.subscription(subscriptionRequest);
  }

  //Subscription Method
  async subscription(subscriptionRequest) {
    return await xtsMarketDataAPI.subscription(subscriptionRequest);
  }

  //XTS Websocket events to find market data
  async registerEvents() {
    xtsMarketDataWS.onConnect((connectData) => {
      console.log(connectData, "connectData");
    });

    xtsMarketDataWS.onJoined((joinedData) => {
      console.log(joinedData, "joinedData");
    });

    xtsMarketDataWS.onMarketDepthEvent((marketDepthData) => {
      console.log(marketDepthData, "marketDepthData");
    });

    xtsMarketDataWS.onError((errorData) => {
      console.log(errorData, "errorData");
    });

    xtsMarketDataWS.onDisconnect((disconnectData) => {
      console.log(disconnectData, "disconnectData");
    });

    xtsMarketDataWS.onLogout((logoutData) => {
      console.log(logoutData, "logoutData");
    });
  }
}

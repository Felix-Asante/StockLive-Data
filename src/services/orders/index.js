import Axios from "axios";
import { axiosInitialParams } from "../../utils";

const baseAPIUrl = process.env.REACT_APP_API_SERVER;
const axios = Axios.create({
  baseURL: baseAPIUrl,
  axiosInitialParams,
});

export const getAllMasterData = (params) =>
  axios.get("/getData", { headers: { Authorization: params } });

export const getAllOpenOrders = (params) =>
  axios.get("/getOpenOrder", { headers: { Authorization: params } });

export const getAllExecutedOrder = (params) =>
  axios.get("/getExecutedOrder", { headers: { Authorization: params } });

export const getAllCompletedTrades = (params) =>
  axios.get("/getCompletedTrade", { headers: { Authorization: params } });

export const placeTradeOrder = (params, token) =>
  axios.post("/placeOrder", params, { headers: { Authorization: token } });

export const modifyTradeOrder = (orderID, token) =>
  axios.put(`/modifyOrder/${orderID}`, { headers: { Authorization: token } });

export const cancelTradeOrder = (orderID, token) =>
  axios.put(`/cancelOrder/${orderID}`, { headers: { Authorization: token } });

export const placeTradesOrder = (params, token) =>
  axios.post("/placeTrade", params, { headers: { Authorization: token } });

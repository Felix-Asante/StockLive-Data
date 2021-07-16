import Axios from "axios";
import { axiosInitialParams } from "../../utils";

const baseAPIUrl = process.env.REACT_APP_API_SERVER;
const axios = Axios.create({
  baseURL: baseAPIUrl,
  axiosInitialParams,
});

export const getAllSymbols = (params) =>
  axios.get("/getData", { headers: { Authorization: params } });

export const storeSymbolDataInServer = (params) =>
  axios.get("/storeData/14", { headers: { Authorization: params } });

export const deleteSymbolDataFromServer = (params) =>
  axios.get("/deleteCollection", { headers: { Authorization: params } });

export const getAllUserAddedSymbols = (params) =>
  axios.get("/getSymbol", { headers: { Authorization: params } });

export const addSymbolToList = async (params, token) => {
  const { data } = await axios.post("/addSymbol", params, {
    headers: { Authorization: token },
  });
  return data;
};

export const deleteSymbolFromList = ({ symbolId, token }) =>
  axios.delete(`/deleteSymbol/${symbolId}`, {
    headers: { Authorization: token },
  });

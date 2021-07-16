import Axios from "axios";
import { message } from "antd";
import { axiosInitialParams } from "../../utils";

const baseAPIUrl = process.env.REACT_APP_API_SERVER;
const axios = Axios.create({
  baseURL: baseAPIUrl,
  axiosInitialParams,
});

export const addFundToWallet = async ({ params, token }) => {
  try {
    const { data, status } = await axios.put("/updateFund", params, {
      headers: { Authorization: token },
    });
    if (status === 200 || data.status_code === 201) {
      message.success("Funds Added");
    }
    return data;
  } catch (err) {
    message.error(err);
  }
};

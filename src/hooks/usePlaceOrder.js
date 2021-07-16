import { useQuery } from "react-query";
import { placeTradeOrder } from "../services/orders";

export default function usePlaceOrder(params) {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery(["placeOrder", params], async () => {
    const { data } = await placeTradeOrder(params, token);
    return data;
  });
}

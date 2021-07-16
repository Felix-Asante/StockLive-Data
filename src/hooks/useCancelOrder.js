import { useQuery } from "react-query";
import { cancelTradeOrder } from "../services/orders";

export default function useCancelOrder(params) {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery(["cancelOrder", params], async () => {
    const { data } = await cancelTradeOrder(params, token);
    return data;
  });
}

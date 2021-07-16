import { useQuery } from "react-query";
import { modifyTradeOrder } from "../services/orders";

export default function useModifyTradeOrder(params) {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery(["modifyOrder", params], async () => {
    const { data } = await modifyTradeOrder(params, token);
    return data;
  });
}

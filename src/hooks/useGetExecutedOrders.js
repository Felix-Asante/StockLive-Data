import { useQuery } from "react-query";
import { getAllExecutedOrder } from "../services/orders";

export default function useGetExecutedOrders() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("getExecutedOrders", async () => {
    const { data } = await getAllExecutedOrder(token);
    return data;
  });
}

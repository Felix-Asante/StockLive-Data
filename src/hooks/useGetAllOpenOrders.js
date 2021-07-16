import { useQuery } from "react-query";
import { getAllOpenOrders } from "../services/orders";

export default function useGetAllOpenOrders() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("getAllOpenOrder", async () => {
    const { data } = await getAllOpenOrders(token);
    return data;
  });
}

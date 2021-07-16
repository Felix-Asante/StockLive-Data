import { useQuery } from "react-query";
import { getAllCompletedTrades } from "../services/orders";

export default function useGetAllCompletedTradesData() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("getAllCompletedTradesData", async () => {
    const { data } = await getAllCompletedTrades(token);
    return data;
  });
}

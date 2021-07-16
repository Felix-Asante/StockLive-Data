import { useQuery } from "react-query";
import { placeTradesOrder } from "../services/orders";

export default function usePlaceTradesOrder(params) {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery(["addTradesOrder", params], async () => {
    const { data } = await placeTradesOrder(params, token);
    return data;
  });
}

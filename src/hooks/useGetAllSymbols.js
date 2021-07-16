import { useQuery } from "react-query";
import { getAllSymbols } from "../services/symbols";

export default function useGetAllSymbols() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("allSymbols", async () => {
    const { data } = await getAllSymbols(token);
    return data;
  });
}

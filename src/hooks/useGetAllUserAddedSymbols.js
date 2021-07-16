import { useQuery } from "react-query";
import { getAllUserAddedSymbols } from "../services/symbols";

export default function useGetAllUserAddedSymbols() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("getAllUserAddedSymbols", async () => {
    const { data } = await getAllUserAddedSymbols(token);
    return data;
  });
}

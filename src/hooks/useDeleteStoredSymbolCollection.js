import { useQuery } from "react-query";
import { deleteSymbolDataFromServer } from "../services/symbols";

export default function useDeleteStoredSymbolCollection() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("deleteStoredSymbolCollection", async () => {
    const { data } = await deleteSymbolDataFromServer(token);
    return data;
  });
}

import { useQuery } from "react-query";
import { storeSymbolDataInServer } from "../services/symbols";

export default function useStoreDataInServer() {
  const token = localStorage.getItem("nseAuthToken");
  return useQuery("storeDataInServer", async () => {
    const { data } = await storeSymbolDataInServer(token);
    return data;
  });
}

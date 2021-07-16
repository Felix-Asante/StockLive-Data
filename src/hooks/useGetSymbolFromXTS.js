import { useQuery } from "react-query";
import Datafeed from "../services/XTSConnection";

export default function useGetSymbolFromXTS(symbols = null) {
  const dataFeed = new Datafeed();
  return useQuery("getSymbolFromXTS", async () => {
    if (symbols) {
      const { data } = await dataFeed.callMasterAPI(symbols);
      return data;
    } else {
      return null;
    }
  });
}

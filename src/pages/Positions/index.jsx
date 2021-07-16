import React from "react";
import PositionTable from "./PositionTable";
import DayHistoryTable from "./DayHistoryTable";
import { useGetAllCompletedTradesData } from "../../hooks";

import "./index.css";

export default function Positions() {
  const { data: completedTradesList } = useGetAllCompletedTradesData();

  return (
    <div style={{ height: "100%" }} className="backgrnd">
      <PositionTable completedTradesList={completedTradesList} />
      <DayHistoryTable />
    </div>
  );
}

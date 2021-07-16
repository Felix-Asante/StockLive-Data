import React from "react";

import OrderNavBar from "./OrderNavBar";
import OpenOrdersTable from "./OpenOrdersTable";
import ExecutedOrdersTable from "./ExecutedOrdersTable";
import TradesOrdersTable from "./TradesOrdersTable";

export default function OrdersWrapper(props) {
  const { openOrdersList, executedOrdersList, completedTradesList } = props;

  return (
    <div className="backgrnd" style={{ height: "100%" }}>
      <OrderNavBar />
      <div className="page-content">
        <div className="orderbook">
          <OpenOrdersTable openOrdersList={openOrdersList} />
          {executedOrdersList && executedOrdersList.length > 0 && (
            <ExecutedOrdersTable executedOrdersList={executedOrdersList} />
          )}
          {completedTradesList && completedTradesList.length > 0 && (
            <TradesOrdersTable completedTradesList={completedTradesList} />
          )}
        </div>
      </div>
    </div>
  );
}

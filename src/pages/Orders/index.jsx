import React from "react";
import OrdersTable from "../../components/OrdersTable";
import {
  useGetAllOpenOrders,
  useGetExecutedOrders,
  useGetAllCompletedTradesData,
} from "../../hooks";

import "./index.css";

export default function Orders() {
  const { data: openOrdersList } = useGetAllOpenOrders();
  const { data: executedOrdersList } = useGetExecutedOrders();
  const { data: completedTradesList } = useGetAllCompletedTradesData();

  return (
    <OrdersTable
      openOrdersList={openOrdersList}
      executedOrdersList={executedOrdersList}
      completedTradesList={completedTradesList}
    />
  );
}

import React from "react";
import clsx from "clsx";
import moment from "moment";
import { FiDownloadCloud } from "react-icons/fi";
import { BiDoughnutChart } from "react-icons/bi";

export default function OpenOrdersTable(props) {
  const { openOrdersList } = props;

  const getQuantityOfOrder = React.useCallback((orderDetails) => {
    if (orderDetails?.TransactionType === "Buy") {
      if (orderDetails?.LastTradedPrice >= orderDetails?.OrderPrice) {
        const totalQuantity = orderDetails?.TotalBuyQuantity;
        const totalTradedQuantity = orderDetails?.TotalTradedQuantity;
        return {
          totalQuantity: totalQuantity,
          totalTradedQuantity: totalTradedQuantity,
        };
      }
    } else {
      if (orderDetails?.LastTradedPrice <= orderDetails?.OrderPrice) {
        const totalQuantity = orderDetails?.TotalSellQuantity;
        const totalTradedQuantity = orderDetails?.TotalTradedQuantity;
        return {
          totalQuantity: totalQuantity,
          totalTradedQuantity: totalTradedQuantity,
        };
      }
    }
  }, []);

  React.useEffect(() => {
    getQuantityOfOrder();
  }, [getQuantityOfOrder]);

  return (
    <div>
      <section className="trades-wrap table-wrapper">
        <header className="row data-table-header">
          <h3 className="page-title small">
            <span className="title">
              <span>Open Orders</span>{" "}
              <span className="icon icon-chevron-up"></span>
            </span>{" "}
            <span>({openOrdersList?.numofdata})</span>
          </h3>
        </header>
        <div className="trades">
          <div tabIndex="1" className="data-table fold-header">
            {/* OpenOrdersTable:Toolbar */}
            <div className="toolbar">
              {" "}
              <span className="search">
                <span className="icon icon-search"></span>{" "}
                <span
                  className="clear icon icon-times"
                  style={{ display: "none" }}
                >
                  <BiDoughnutChart />
                </span>
                <div className="search-input su-input-group">
                  <input
                    type="search"
                    placeholder="Search"
                    autoCorrect="off"
                    maxLength="15"
                    label=""
                    rules=""
                    dynamicwidthsize="8"
                  />
                </div>
              </span>{" "}
              <span className="toolbar-before">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://console.zerodha.com/reports/tradebook"
                >
                  <span className="icon icon-console">
                    <BiDoughnutChart />
                  </span>
                  View reports
                </a>
              </span>{" "}
              <span className="download">
                <span className="download-csv link">
                  <span className="icon icon-download">
                    <FiDownloadCloud />
                  </span>
                  <a href="/" className="hide download-link">
                    Download
                  </a>
                </span>
              </span>{" "}
            </div>

            {/* OpenOrdersTable */}
            <table>
              <thead>
                <tr>
                  <th className="fill-timestamp">
                    <span>Time</span>
                  </th>
                  <th className="transaction-type">
                    <span>Type</span>
                  </th>
                  <th className="instrument">
                    <span>Instrument</span>
                  </th>
                  <th className="product">
                    <span>Product</span>
                  </th>
                  <th className="quantity right">
                    <span>Qty.</span>
                  </th>
                  <th className="average-price right">
                    <span>LTP</span>
                  </th>
                  <th className="average-price right">
                    <span>Price</span>
                  </th>
                  <th className="average-price">
                    <span>Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {openOrdersList &&
                  openOrdersList?.data?.map((orderDetails, index) => {
                    return (
                      <tr key={index} data-uid={index}>
                        <td className="fill-timestamp">
                          {moment
                            .utc(orderDetails.createdAt)
                            .local()
                            .format("HH:mm:ss")}
                        </td>
                        <td className="transaction-type">
                          <span
                            className={clsx(
                              "text-label small",
                              orderDetails.TransactionType === "Buy"
                                ? "blue"
                                : "red"
                            )}
                          >
                            {orderDetails.TransactionType}
                          </span>
                        </td>
                        <td className="instrument">
                          <span className="tradingsymbol">
                            <span>{orderDetails.SymbolName}</span>
                          </span>{" "}
                          <span className="exchange text-xxsmall dim">
                            {orderDetails.ExchangeSegment}
                          </span>
                        </td>
                        <td className="product">{orderDetails.ProductType}</td>
                        <td className="quantity right">
                          {getQuantityOfOrder(orderDetails)}
                        </td>
                        <td className="quantity right">{orderDetails.LTP} </td>
                        <td className="average-price right">
                          {orderDetails.OrderPrice}
                        </td>
                        <td className="transaction-type">
                          <span className="text-label small uppercase">
                            {orderDetails.Status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot />
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

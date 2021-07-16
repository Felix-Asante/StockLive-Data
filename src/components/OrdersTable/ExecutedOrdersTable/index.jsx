import React from "react";
import clsx from "clsx";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import { FiDownloadCloud } from "react-icons/fi";
import { BiDoughnutChart } from "react-icons/bi";

export default function ExecutedOrdersTable(props) {
  const { executedOrdersList } = props;
  return (
    <div>
      <section className="completed-orders-wrap table-wrapper">
        <header className="row data-table-header">
          <h3 className="page-title small">
            Executed orders
            <span>({executedOrdersList?.numofdata})</span>
          </h3>
        </header>

        <div className="completed-orders">
          <div tabIndex="1" className="data-table fold-header">
            {/* ExecutedOrdersTable:Toolbar */}
            <div className="toolbar">
              {" "}
              <span className="search">
                <span className="icon icon-search">
                  <FaSearch />
                </span>{" "}
                <span
                  className="clear icon icon-times"
                  style={{ display: "none" }}
                />
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

            {/* ExecutedTable */}
            <table>
              <thead>
                <tr>
                  <th className="order-timestamp sortable">
                    <span>Time</span>
                  </th>
                  <th className="transaction-type sortable">
                    <span>Type</span>
                  </th>
                  <th className="instrument sortable">
                    <span>Instrument</span>
                    <span className="icon"> </span>
                  </th>
                  <th className="product sortable">
                    <span>Product</span>
                  </th>
                  <th className="quantity right sortable">
                    <span>Qty.</span>
                  </th>
                  <th className="average-price right sortable">
                    <span>Avg. price</span>
                  </th>
                  <th className="order-status sortable">
                    <span>Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {executedOrdersList &&
                  executedOrdersList?.data?.map((orders, index) => {
                    return (
                      <tr key={index} data-uid={index}>
                        <td className="order-timestamp">
                          {moment
                            .utc(orders.createdAt)
                            .local()
                            .format("HH:mm:ss")}
                        </td>
                        <td className="transaction-type">
                          <span
                            className={clsx(
                              "text-label small",
                              orders.TransactionType === "Buy" ? "blue" : "red"
                            )}
                          >
                            {orders.TransactionType}
                          </span>
                        </td>
                        <td className="instrument">
                          <span className="tradingsymbol">
                            <span>{orders.SymbolName}</span>
                          </span>{" "}
                          <span className="exchange text-xxsmall dim">
                            {orders.ExchangeSegment}
                          </span>
                        </td>
                        <td className="product">{orders.ProductType}</td>
                        <td className="quantity right">
                          {orders.OrderQuantity}
                        </td>
                        <td className="average-price right">
                          <span>{orders.OrderPrice}</span>
                        </td>
                        <td className="order-status">
                          <span
                            className={clsx(
                              "text-label small order-status-label",
                              orders.Status === "Completed"
                                ? "green"
                                : orders.Status === "Rejected"
                                ? "red"
                                : orders.Status === "Cancelled"
                                ? "grey"
                                : ""
                            )}
                          >
                            <span className="uppercase">{orders.Status}</span>
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

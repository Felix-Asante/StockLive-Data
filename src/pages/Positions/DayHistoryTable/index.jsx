import React from "react";
import clsx from "clsx";
import moment from "moment";
import { FiDownloadCloud } from "react-icons/fi";
import { BiDoughnutChart } from "react-icons/bi";

export default function DayHistoryTable() {
  const dayHistoryTableData = [];
  return (
    <div className="backgrnd">
      <div className="page-content">
        <div className="orderbook">
          <section className="trades-wrap table-wrapper">
            <header className="row data-table-header">
              <h3 className="page-title small">
                <span className="title">
                  <span>Day's History</span>{" "}
                  <span className="icon icon-chevron-up"></span>
                </span>{" "}
                <span>({dayHistoryTableData?.numofdata})</span>
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
                    {dayHistoryTableData &&
                      dayHistoryTableData?.data?.map((orders, index) => {
                        return (
                          <tr key={index} data-uid={index}>
                            <td className="fill-timestamp">
                              {moment
                                .utc(orders.createdAt)
                                .local()
                                .format("HH:mm:ss")}
                            </td>
                            <td className="transaction-type">
                              <span
                                className={clsx(
                                  "text-label small",
                                  orders.TransactionType === "Buy"
                                    ? "blue"
                                    : "red"
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
                            <td className="quantity right">67.65</td>
                            <td className="average-price right">
                              {orders.OrderPrice}
                            </td>
                            <td className="transaction-type">
                              <span className="text-label small uppercase">
                                {orders.Status}
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
      </div>
    </div>
  );
}

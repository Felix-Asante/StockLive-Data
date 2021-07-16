import React from "react";
import clsx from "clsx";
import { FiDownloadCloud } from "react-icons/fi";
import { BiDoughnutChart } from "react-icons/bi";

export default function PositionTable(props) {
  const { completedTradesList } = props;
  return (
    <div className="backgrnd">
      <div className="page-content">
        <div className="orderbook">
          <section className="trades-wrap table-wrapper">
            <header className="row data-table-header">
              <h3 className="page-title small">
                <span className="title">
                  <span>Positions</span>{" "}
                  <span className="icon icon-chevron-up"></span>
                </span>{" "}
                <span>({completedTradesList?.numofdata})</span>
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
                      <th className="product">
                        <span>Product</span>
                      </th>

                      <th className="instrument">
                        <span>Instrument</span>
                      </th>

                      <th className="quantity right">
                        <span>Qty.</span>
                      </th>
                      <th className="average-price">
                        <span>Avg.</span>
                      </th>
                      <th className="average-price right">
                        <span>LTP</span>
                      </th>
                      <th className="average-price right">
                        <span>P&L</span>
                      </th>
                      <th className="average-price">
                        <span>Chg.</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTradesList &&
                      completedTradesList?.data?.map((orders, index) => {
                        return (
                          <tr key={index} data-uid={index}>
                            <td className="product">{orders.ProductType}</td>
                            <td className="transaction-type">
                              <span
                                className={clsx(
                                  "text-label small",
                                  orders.TransactionType === "Buy"
                                    ? "blue"
                                    : orders.TransactionType === "Sell"
                                    ? "red"
                                    : orders.TransactionType === ""
                                    ? "grey"
                                    : ""
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
                            <td className="quantity right">
                              {orders.OrderQuantity}
                            </td>
                            <td className="quantity right">
                              {orders.LastTradedPrice}
                            </td>
                            <td className="average-price right">
                            </td>
                            <td className="transaction-type">
                              <span
                                className={clsx("text-label small uppercase")}
                              ></span>
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

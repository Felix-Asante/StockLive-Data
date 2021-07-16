import React from "react";
import clsx from "clsx";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Actions from "../ActionBar";
import Datafeed from "../../../services/XTSConnection";

import "bootstrap/dist/css/bootstrap.min.css";

export default function UserAddedSymbolLists(props) {
  const { userAddedSymbols } = props;
  const dataFeed = new Datafeed();

  React.useEffect(() => {
    async function fetchData() {
      if (userAddedSymbols) {
        await dataFeed.callMasterAPI(userAddedSymbols);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddedSymbols]);
  return (
    <>
      {userAddedSymbols?.map((symbols, index) => {
        let customRef = React.createRef();
        return (
          <div
            key={index}
            className="vddl-draggable instrument down"
            onMouseEnter={() => {
              customRef.current.className = "";
            }}
            onMouseLeave={() => {
              customRef.current.className = "hide";
            }}
          >
            <div className={clsx("info")}>
              <span className="symbol">
                <span className="nice-name">{symbols.Description} </span>
              </span>{" "}
              <span className="price">
                <span className="dim">
                  11.12
                  <span className="text-xxsmall">%</span>
                </span>
                <span
                  className={clsx("change-indicator icon icon-chevron-down ")}
                >
                  {11 > 0 ? <FaAngleUp /> : <FaAngleDown />}
                </span>
                <span className={clsx("last-price ")}>{symbols.LTP}</span>
              </span>
            </div>
            <div ref={customRef} className="hide">
              <Actions currentSymbol={symbols} isAddActionAvailabe={false} />
            </div>
          </div>
        );
      })}
    </>
  );
}

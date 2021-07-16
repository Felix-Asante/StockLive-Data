import React from "react";
import clsx from "clsx";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import Actions from "../ActionBar";

import "bootstrap/dist/css/bootstrap.min.css";

export default function SearchedOrAllSymbolLists(props) {
  const { filteredSymbolListData } = props;

  return (
    <>
      {filteredSymbolListData?.map((symbols, index) => {
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
            <div className={clsx("info ")}>
              <span className="symbol">
                <span className="nice-name">{symbols.Description} </span>
              </span>{" "}
              <span className="price">
                <span className="dim">
                  11.11
                  <span className="text-xxsmall">%</span>
                </span>
                <span
                  className={clsx("change-indicator icon icon-chevron-down ")}
                >
                  {11.2 > 0 ? <FaAngleUp /> : <FaAngleDown />}
                </span>
                <span className={clsx("last-price")}>{symbols.LTP}</span>
              </span>
            </div>
            <div ref={customRef} className="hide">
              <Actions currentSymbol={symbols} isAddActionAvailabe={true} />
            </div>
          </div>
        );
      })}
    </>
  );
}

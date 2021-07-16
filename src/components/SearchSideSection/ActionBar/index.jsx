import React from "react";
import { message, Modal } from "antd";
import Draggable from "react-draggable";
import { useMutation } from "react-query";
import { FaTrash } from "react-icons/fa";
import { FiAlignCenter } from "react-icons/fi";
import { GrLineChart } from "react-icons/gr";
import { IoIosAdd } from "react-icons/io";

import {
  deleteSymbolFromList,
  addSymbolToList,
} from "../../../services/symbols";
import { BuyForm, SellForm } from "../BuySellForms";

export default function Actions(props) {
  const { currentSymbol, isAddActionAvailabe } = props;
  const token = localStorage.getItem("nseAuthToken");
  const draggleRef = React.createRef();
  const [buyVisible, setBuyVisible] = React.useState(false);
  const [buyDisabled, setBuyDisabled] = React.useState(true);
  const [sellVisible, setSellVisible] = React.useState(false);
  const [sellDisabled, setSellDisabled] = React.useState(true);
  const [bounds, setBounds] = React.useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const {
    mutate: deleteSymbol,
    data: deleteSymbolData,
    isSuccess: sucessfullyDeletedSymbol,
  } = useMutation((data) => deleteSymbolFromList(data));
  const {
    mutate: addSymbol,
    isSuccess: sucessfullyAddedSymbol,
    isError: facingErrorToAddSymbol,
  } = useMutation((data) => addSymbolToList(data, token));

  function handleAddSymbolToList() {
    const query = {
      exchangeSegment: currentSymbol.ExchangeSegment,
      exchangeInstrumentID: currentSymbol.ExchangeInstrumentID,
      description: currentSymbol.Description,
      symbolName: currentSymbol.Name,
      seriesName: currentSymbol.Series,
    };
    addSymbol(query);
  }

  function handleOk() {
    setBuyVisible(false);
    setSellVisible(false);
  }

  function handleCancel() {
    setBuyVisible(false);
    setSellVisible(false);
  }

  function showBuyModal() {
    setBuyVisible(true);
  }

  function showSellModal() {
    setSellVisible(true);
  }

  function handleDeleteSymbolFromList() {
    const symbolId = currentSymbol._id;
    deleteSymbol({ symbolId: symbolId, token: token });
  }

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = draggleRef?.current?.getBoundingClientRect();
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };

  React.useEffect(() => {
    if (facingErrorToAddSymbol) {
      message.error("Symbol already added");
    }
    if (sucessfullyAddedSymbol) {
      message.success("Added Symbol successfully");
    }
  }, [facingErrorToAddSymbol, sucessfullyAddedSymbol]);

  React.useEffect(() => {
    if (sucessfullyDeletedSymbol && deleteSymbolData.status_code === 201) {
      message.success(deleteSymbolData.message);
    } else if (
      !sucessfullyDeletedSymbol &&
      deleteSymbolData?.status_code === 500
    ) {
      message.error(deleteSymbolData.message);
    }
  }, [deleteSymbolData, sucessfullyDeletedSymbol]);

  return (
    <>
      <span className="actions " id="hovar1">
        <span data-balloon="Buy (B)" data-balloon-pos="up">
          <button
            type="button"
            className="button-blue buy"
            onClick={showBuyModal}
          >
            B{" "}
          </button>
          <Modal
            title={
              <div
                className="order-window layer-2 place buy"
                style={{
                  width: "100%",
                  cursor: "move",
                }}
                onMouseOver={() => {
                  if (buyDisabled) {
                    setBuyDisabled(false);
                  }
                }}
                onMouseOut={() => {
                  setBuyDisabled(true);
                }}
              >
                <header>
                  <div className="row">
                    <div className="eight columns">
                      <div className="instrument">
                        <span className="transaction-type"></span>{" "}
                        <span className="tradingsymbol">
                          <span className="name">{currentSymbol?.Name} </span>{" "}
                          <span className="exchange">
                            {currentSymbol?.Series}
                          </span>
                        </span>
                        ×<span className="qty">1 Qty</span>
                      </div>
                    </div>
                  </div>
                  <div className="exchange-selector">
                    <div className="su-radio-group">
                      <div className="exchange su-radio-wrap checked">
                        <label className="su-radio-label">
                          {currentSymbol?.ExchangeSegment}:{" "}
                          <span className="last-price">
                            ₹{currentSymbol?.LTP}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </header>
              </div>
            }
            visible={buyVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
            modalRender={(modal) => (
              <Draggable
                disabled={buyDisabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}
              >
                <div ref={draggleRef}>{modal}</div>
              </Draggable>
            )}
          >
            <BuyForm typeVal="Buy" handleCancel={handleCancel} />
          </Modal>
        </span>
        <span data-balloon="Sell (S)" data-balloon-pos="up">
          <button
            type="button"
            className="button-orange sell"
            onClick={showSellModal}
          >
            S
          </button>
          <Modal
            title={
              <div
                className="order-window layer-2 place sell"
                style={{
                  width: "100%",
                  cursor: "move",
                }}
                onMouseOver={() => sellDisabled && setSellDisabled(false)}
                onMouseOut={() => setSellDisabled(true)}
              >
                <header>
                  <div className="row">
                    <div className="eight columns">
                      <div className="instrument">
                        <span className="transaction-type"></span>{" "}
                        <span className="tradingsymbol">
                          <span className="name">{currentSymbol?.Name}</span>{" "}
                          <span className="exchange">
                            {currentSymbol?.Series}
                          </span>
                        </span>
                        ×<span className="qty">1 Qty</span>
                      </div>
                    </div>
                  </div>
                  <div className="exchange-selector">
                    <div className="su-radio-group">
                      <div className="exchange su-radio-wrap checked">
                        <label className="su-radio-label">
                          {currentSymbol?.ExchangeSegment}:{" "}
                          <span className="last-price">
                            ₹{currentSymbol?.LTP}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </header>
              </div>
            }
            visible={sellVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={false}
            modalRender={(modal) => (
              <Draggable
                disabled={sellDisabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}
              >
                <div ref={draggleRef}>{modal}</div>
              </Draggable>
            )}
          >
            <SellForm typeVal="Sell" handleCancel={handleCancel} />
          </Modal>
        </span>
        <span data-balloon="Market Depth" data-balloon-pos="up">
          <button type="button" className="button-outline">
            <span className="icon icon-align-center">
              <FiAlignCenter />
            </span>
          </button>
        </span>
        <span data-balloon="Chart" data-balloon-pos="up">
          <button type="button" className="button-outline">
            <span className="icon icon-trending-up">
              <GrLineChart />
            </span>
          </button>
        </span>
        {!isAddActionAvailabe && (
          <span data-balloon="Delete" data-balloon-pos="up">
            <button
              type="button"
              className="button-outline"
              onClick={handleDeleteSymbolFromList}
            >
              <span className="icon icon-trash">
                <FaTrash />
              </span>{" "}
            </button>
          </span>
        )}
        {isAddActionAvailabe && (
          <span data-balloon="Add" data-balloon-pos="up">
            <button
              type="button"
              className="button-outline"
              onClick={handleAddSymbolToList}
            >
              <span className="icon icon-add">
                <IoIosAdd />
              </span>{" "}
            </button>
          </span>
        )}
      </span>
    </>
  );
}

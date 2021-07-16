import React from "react";
import clsx from "clsx";
import { message, Radio } from "antd";
import { useMutation } from "react-query";

import { placeTradeOrder } from "../../../services/orders";

export default function BuyForm(props) {
  const { typeVal, handleCancel } = props;
  const token = localStorage.getItem("nseAuthToken");
  const [quantityValue, setQuantityValue] = React.useState(0);
  const [orderType, setOrderType] = React.useState("MARKET");
  const [triggerType, setTriggerType] = React.useState("SL");
  const [positionType, setPositionType] = React.useState("Intraday");
  const {
    mutate: placeOrderMutation,
    data: placeOrderData,
    isSuccess: sucessfullyPlacedOrder,
  } = useMutation((data) => placeTradeOrder(data, token));

  const handleSubmitBuyForm = (event) => {
    event.preventDefault();
    const query = {
      transactionType: typeVal,
      exchangeSegment: "NSECM",
      exchangeInstrumentId: 22,
      symbolName: "ICICI",
      orderQuantity: Number(quantityValue),
      orderType: orderType,
      productType: "MIS",
      orderPrice: 77.3,
      triggerPrice: 0,
      disclosedQuantity: 0,
      duration: "Day",
    };
    placeOrderMutation(query);
  };

  const handleQuantityChange = (event) => {
    setQuantityValue(event.target.value);
  };

  const onOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const onBuyTypeChange = (event) => {
    setTriggerType(event.target.value);
  };

  const onPositionTypeChange = (event) => {
    setPositionType(event.target.value);
  };

  React.useEffect(() => {
    if (sucessfullyPlacedOrder) {
      message.success(placeOrderData.message);
    }
  }, [placeOrderData, sucessfullyPlacedOrder]);

  return (
    <>
      <form
        className="order-window layer-2 place buy"
        onSubmit={handleSubmitBuyForm}
      >
        <section className="wrap">
          <div className="variety">
            <div className="su-radio-group">
              <div
                className="type su-radio-wrap checked"
                data-balloon="Regular order"
                data-balloon-pos="up"
              >
                <input
                  id="radio-148"
                  type="radio"
                  name="variety"
                  title="Regular order"
                  label="Regular"
                  className="su-radio"
                  value="regular"
                />{" "}
                <label className="su-radio-label">Regular</label>
              </div>
              <div
                className="type su-radio-wrap"
                data-balloon="Cover order"
                data-balloon-pos="up"
              >
                <input
                  id="radio-149"
                  type="radio"
                  name="variety"
                  title="Cover order"
                  label="Cover"
                  className="su-radio"
                  value="co"
                />{" "}
                <label className="su-radio-label">Cover</label>
              </div>
              <div
                className="type su-radio-wrap"
                data-balloon="After Market Order (for the next day)"
                data-balloon-pos="up"
              >
                <input
                  id="radio-150"
                  type="radio"
                  name="variety"
                  title="After Market Order (for the next day)"
                  label="AMO"
                  className="su-radio"
                  value="amo"
                />{" "}
                <label className="su-radio-label">AMO</label>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="product row">
              <Radio.Group onChange={onPositionTypeChange} value={positionType}>
                <div className="su-radio-group">
                  <div
                    className="type four columns su-radio-wrap"
                    data-balloon="Margin Intraday Squareoff: Requires lower margin. Has to be exited before market close."
                    data-balloon-pos="up"
                    data-balloon-length="large"
                  >
                    <Radio value="Intraday">
                      <label
                        className="su-radio-label"
                        title="Margin Intraday Squareoff: Requires lower margin. Has to be exited before market close."
                      >
                        Intraday <span>MIS</span>
                      </label>
                    </Radio>
                  </div>
                  <div
                    className="type four columns su-radio-wrap checked"
                    data-balloon="CashNCarry: Longterm investment. Requires full upfront margin."
                    data-balloon-pos="up"
                    data-balloon-length="large"
                  >
                    <Radio value="Longterm">
                      <label
                        className="su-radio-label"
                        title="CashNCarry: Longterm investment. Requires full upfront margin."
                      >
                        Longterm <span>CNC</span>
                      </label>
                    </Radio>
                  </div>
                </div>
              </Radio.Group>
            </div>
            <div className="fields">
              <div className="row">
                <div className="four columns quantity">
                  <div className="no su-input-group su-static-label">
                    <label className="su-input-label su-visible">Qty.</label>{" "}
                    <input
                      type="number"
                      autoCorrect="off"
                      min="1"
                      step="1"
                      autoFocus="autofocus"
                      nativeerror="true"
                      staticlabel="true"
                      animate="true"
                      label="Qty."
                      dynamicwidthsize="8"
                      onChange={handleQuantityChange}
                    />
                  </div>
                </div>
                <div className="four columns price">
                  <div
                    className={clsx(
                      "no su-input-group su-static-label",
                      orderType === "MARKET" && "disabled"
                    )}
                  >
                    <label className="su-input-label su-visible">Price</label>{" "}
                    <input
                      type="number"
                      placeholder=""
                      autoCorrect="off"
                      min="0.05"
                      step="0.05"
                      nativeerror="true"
                      staticlabel="true"
                      animate="true"
                      label="Price"
                      dynamicwidthsize="8"
                      disabled={orderType === "MARKET"}
                    />
                  </div>
                </div>
                <div className="four columns trigger">
                  <div className="no su-input-group su-static-label disabled">
                    <label className="su-input-label">Trigger price</label>{" "}
                    <input
                      type="number"
                      placeholder=""
                      autoCorrect="off"
                      min="0"
                      step="0.05"
                      disabled={triggerType === "SL"}
                      nativeerror="true"
                      staticlabel="true"
                      animate="true"
                      label="Trigger price"
                      dynamicwidthsize="8"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="four columns price">
                  <div className="su-radio-group order-type">
                    <div
                      className="su-radio-wrap"
                      tooltip-pos="down"
                      data-balloon="Buy at market price"
                      data-balloon-pos="down"
                    >
                      <Radio.Group
                        onChange={onOrderTypeChange}
                        value={orderType}
                      >
                        <Radio value="MARKET">
                          <label
                            className="su-radio-label"
                            title="Buy at market price"
                          >
                            Market
                          </label>
                        </Radio>
                        <Radio value="LIMIT">
                          <label
                            className="su-radio-label"
                            title="Buy at market price"
                          >
                            Limit
                          </label>
                        </Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
                <div className="four columns trigger">
                  <div className="su-radio-group text-right order-type">
                    <Radio.Group onChange={onBuyTypeChange} value={triggerType}>
                      <Radio value="SL">
                        <label
                          className="su-radio-label"
                          title="Buy at a preferred price with a stoploss"
                        >
                          SL
                        </label>
                      </Radio>
                      <Radio value="SL-M">
                        <label
                          className="su-radio-label"
                          title="Buy at market price with stoploss"
                        >
                          SL-M
                        </label>
                      </Radio>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="row">
              <div className="six columns">
                <div className="row margins">
                  <span className="label">
                    Margin required
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href="https://support.zerodha.com/category/trading-and-markets/kite-web-and-mobile/articles/margins-on-kite-order-window"
                      className="info"
                      data-balloon="Margin calculation explained"
                      data-balloon-pos="up"
                    >
                      <span className="icon icon-info"></span>
                    </a>
                  </span>{" "}
                  <span className="margin-value">₹1,861.95</span>
                  <a href="/" data-balloon="Refresh" data-balloon-pos="up">
                    <span className="reload-margin icon icon-reload"></span>
                  </a>
                </div>
              </div>
              <div className="six columns text-right actions">
                <button type="submit" className="submit" onClick={handleCancel}>
                  <span>Buy</span>
                </button>{" "}
                <button
                  type="button"
                  className="button-outline cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </footer>
        </section>
      </form>
    </>
  );
}

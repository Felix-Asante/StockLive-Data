import React from "react";
import clsx from "clsx";
import { message, Radio } from "antd";
import { useMutation } from "react-query";

import { placeTradeOrder } from "../../../services/orders";

export default function SellForm(props) {
  const { typeVal, handleCancel } = props;
  const token = localStorage.getItem("nseAuthToken");
  const [quantityValue, setQuantityValue] = React.useState(0);
  const [orderType, setOrderType] = React.useState("MARKET");
  const {
    mutate: placeOrderMutation,
    data: placeOrderData,
    isSuccess: sucessfullyPlacedOrder,
  } = useMutation((data) => placeTradeOrder(data, token));

  const handleSubmitSellForm = (event) => {
    event.preventDefault();
    const params = {
      transactionType: typeVal,
      exchangeSegment: "NSECM",
      exchangeInstrumentId: 22,
      symbolName: "HDFC",
      orderQuantity: Number(quantityValue),
      orderType: orderType,
      productType: "MIS",
      orderPrice: 77.3,
      triggerPrice: 0,
      disclosedQuantity: 0,
      duration: "Day",
    };
    placeOrderMutation(params);
  };

  const handleQuantityChange = (event) => {
    setQuantityValue(event.target.value);
  };

  const onOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  React.useEffect(() => {
    if (sucessfullyPlacedOrder) {
      message.success(placeOrderData.message);
    }
  }, [placeOrderData, sucessfullyPlacedOrder]);

  return (
    <>
      <form
        className="order-window layer-2 place sell"
        onSubmit={handleSubmitSellForm}
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
              <div className="su-radio-group">
                <div
                  className="type four columns su-radio-wrap"
                  data-balloon="Margin Intraday Squareoff: Requires lower margin. Has to be exited before market close."
                  data-balloon-pos="up"
                  data-balloon-length="large"
                >
                  <Radio>
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
                  <Radio>
                    <label
                      className="su-radio-label"
                      title="CashNCarry: Longterm investment. Requires full upfront margin."
                    >
                      Longterm <span>CNC</span>
                    </label>
                  </Radio>
                </div>
              </div>
            </div>
            <div className="fields">
              <div className="row">
                <div className="four columns quantity">
                  <div className="no su-input-group su-static-label">
                    <label className="su-input-label su-visible">Qty.</label>{" "}
                    <input
                      type="number"
                      placeholder=""
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
                      disabled="disabled"
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
                    <div
                      className="su-radio-wrap"
                      tooltip-pos="down"
                      data-balloon="Buy at a preferred price with a stoploss"
                      data-balloon-pos="down"
                    >
                      <Radio>
                        <label
                          className="su-radio-label"
                          title="Buy at a preferred price with a stoploss"
                        >
                          SL
                        </label>
                      </Radio>
                    </div>
                    <div
                      className="su-radio-wrap"
                      tooltip-pos="down"
                      data-balloon="Buy at market price with stoploss"
                      data-balloon-pos="down"
                    >
                      <Radio>
                        <label
                          className="su-radio-label"
                          title="Buy at market price with stoploss"
                        >
                          SL-M
                        </label>
                      </Radio>
                    </div>
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
                  <span>Sell</span>
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

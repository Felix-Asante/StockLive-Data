import React from "react";
import clsx from "clsx";
import { Popover } from "antd";
import { withRouter } from "react-router";
import { useHistory, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FiLogOut } from "react-icons/fi";

import { userProfileData, initialNameOfUser } from "../../recoils/profile";

import "./index.css";

function NavBar(props) {
  const history = useHistory();
  const profileData = useRecoilValue(userProfileData);
  const userInitialName = useRecoilValue(initialNameOfUser);

  function handleLogout() {
    localStorage.clear();
    history.push("/account/login");
  }

  const popoverDropdownContent = (
    <>
      <span
        style={{
          color: "#444444",
          fontSize: "16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {profileData?.full_name}
      </span>
      <span style={{ color: "#0c0808", fontSize: "13px" }}>
        {profileData?.email}
      </span>
      <hr />
      <div
        style={{
          color: "#0c0808",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleLogout}
      >
        <FiLogOut fontSize="16px" />
        <span style={{ fontSize: "14px", marginLeft: "5px" }}>logout</span>
      </div>
    </>
  );

  return (
    <div className="header">
      <div className="wrapper">
        <div className="header-left">
          <div className="pinned-instruments">
            <div className="instrument-widget">
              <span
                tooltip-pos="down"
                className="tradingsymbol link-chart"
                data-balloon="Open chart"
                data-balloon-pos="down"
              >
                NIFTY 50
              </span>{" "}
              <span className="wrap">
                <span className="last-price down">14549.40</span>{" "}
                <span className="price-change dim">
                  <span className="change-percent dim">
                    -1.79 <span className="text-xxsmall">%</span>
                  </span>
                </span>
              </span>
            </div>
            <div className="instrument-widget">
              <span
                tooltip-pos="down"
                className="tradingsymbol link-chart"
                data-balloon="Open chart"
                data-balloon-pos="down"
              >
                SENSEX
              </span>{" "}
              <span className="wrap">
                <span className="last-price down">49180.31</span>{" "}
                <span className="price-change dim">
                  <span className="change-percent dim">
                    -1.74 <span className="text-xxsmall">%</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <Link to="/" className="logo">
            <img
              src="https://kite.zerodha.com/static/images/kite-logo.svg"
              alt="Kite logo"
            />
          </Link>
          <div className="app-nav">
            <Link
              to="/"
              className={clsx(
                props.location.pathname === "/dashboard" &&
                  "orders-nav-item router-link-exact-active router-link-active"
              )}
            >
              <span>Dashboard</span>
            </Link>{" "}
            <Link
              to="/orders"
              className={clsx(
                props.location.pathname === "/orders" &&
                  "orders-nav-item router-link-exact-active router-link-active"
              )}
              aria-current="page"
            >
              <span>Orders</span>
            </Link>{" "}
            <Link
              to="/holdings"
              className={clsx(
                props.location.pathname === "/holdings" &&
                  "orders-nav-item router-link-exact-active router-link-active"
              )}
            >
              <span>Holdings</span>
            </Link>{" "}
            <Link
              to="/positions"
              className={clsx(
                props.location.pathname === "/positions" &&
                  "orders-nav-item router-link-exact-active router-link-active"
              )}
            >
              <span>Positions</span>
            </Link>{" "}
            <Link
              to="/funds"
              className={clsx(
                props.location.pathname === "/funds" &&
                  "orders-nav-item router-link-exact-active router-link-active"
              )}
            >
              <span>Funds</span>
            </Link>{" "}
            <Link
              to="/apps"
              className={clsx(
                props.location.pathname === "/apps" &&
                  "orders-nav-item router-link-exact-active router-link-active"
              )}
            >
              <span>Apps</span>
            </Link>
          </div>
          <div className="right-nav">
            <div
              className="user-nav perspective"
              style={{ alignItems: "center", cursor: "pointer" }}
            >
              <div className="dropdown-label">
                <div id="avatar-43">
                  <div
                    className="avatar"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      backgroundColor: "rgba(156, 39, 176, 0.1)",
                      fontSize: "9px",
                      fontWeight: "300px",
                      lineHeight: "26px",
                    }}
                  >
                    <Popover content={popoverDropdownContent}>
                      <span style={{ color: "rgb(156, 39, 176)" }}>
                        {userInitialName}
                      </span>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(NavBar);

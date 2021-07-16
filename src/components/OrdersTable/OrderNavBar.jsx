import React from "react";

export default function OrderNavBar() {
  return (
    <div className="page-nav">
      <a
        href="/orders"
        aria-current="page"
        className="router-link-exact-active router-link-active"
      >
        <span>Orders</span>
      </a>
      <a href="/orders">
        <span>GTT</span>
      </a>
      <a href="/orders">
        <span>Baskets</span>
      </a>
      <a href="/orders">
        <span>SIP</span>
      </a>
    </div>
  );
}

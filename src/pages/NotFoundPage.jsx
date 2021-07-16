import React from "react";

export default function NotFoundPage(props) {
  const { history } = props;
  return (
    <>
      <button onClick={() => history.push("/")}>Back to home</button>
    </>
  );
}

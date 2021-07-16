import React from "react";
import axios from "axios";
import socketIoClient from "socket.io-client";

const url = process.env.REACT_APP_XTS_URL;
const userID = process.env.REACT_APP_XTS_USERID;
const password = process.env.REACT_APP_XTS_PASSWORD;
const publicKey = process.env.REACT_APP_XTS_APPKEY;
const publishFormat = process.env.REACT_APP_XTS_PUBLISH_FORMAT;
const broadcastFormat = process.env.REACT_APP_XTS_BROADCAST_FORMAT;
const data = {
  userID: userID,
  password: password,
  publicKey: publicKey,
  source: "WEB",
};
export default function SocketHandler() {
  axios
    .post({
      url: `${url}/auth/login`,
      json: true,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
      body: data,
    })
    .then((body) => {
      if (body.type === "success") {
        if (body.result.token) {
          let token = body.result.token;
          let socket = socketIoClient(url, {
            path: "/socket.io",
            query: {
              token: token,
              userID: userID,
              publishFormat: publishFormat,
              broadcastMode: broadcastFormat,
            },
          });
          socket.on("1502-json-full", function (data) {
            console.log("data is ", data);
          });
        } else {
          console.log(body.description, "body.description");
        }
      }
    });

  return <></>;
}

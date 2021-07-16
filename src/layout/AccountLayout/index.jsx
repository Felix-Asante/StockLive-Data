import React from "react";
import { renderRoutes } from "react-router-config";
import { Layout } from "antd";

const { Content } = Layout;

export default function AccountLayout(props) {
  const { route } = props;
  return (
    <div className="account-layout">
      <Layout style={{ paddingBottom: "6.7rem" }}>
        <Content
          className="site-layout"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <div className="site-layout-background">
            {renderRoutes(route.routes)}
          </div>
        </Content>
      </Layout>
    </div>
  );
}

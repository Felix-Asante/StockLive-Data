import React from "react";
import { renderRoutes } from "react-router-config";
import { Layout } from "antd";

import Navigation from "../../components/Header/Navbar";
import SearchSideSection from "../../components/SearchSideSection";

import "./index.css";

const { Content } = Layout;

export default function MainLayout(props) {
  const { route } = props;
  return (
    <div className="main-layout">
      <Layout className="layout">
        <Navigation />
        <Content className="site-layout">
          <SearchSideSection />
          <div className="site-layout-background">
            {renderRoutes(route.routes)}
          </div>
        </Content>
      </Layout>
    </div>
  );
}

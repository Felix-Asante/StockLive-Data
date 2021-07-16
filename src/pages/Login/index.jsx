import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { Form, Input, Button, Typography, Card, Row, Col, Layout } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { requestUserLogin } from "../../services/auth";

import "./style.css";

const validationRules = {
  username: [{ required: true, message: "Please input your Username!" }],
  password: [{ required: true, message: "Please input your Password!" }],
};

export default function Login() {
  const history = useHistory();
  const {
    mutate: login,
    data: loginData,
    isSuccess: sucessfullyLoggedIn,
    isLoading: isLogging,
  } = useMutation((data) => requestUserLogin(data));

  const onFinish = (values) => {
    const query = {
      Email: values.username,
      Password: values.password,
    };
    login(query);
  };

  React.useEffect(() => {
    if (sucessfullyLoggedIn && loginData?.status_code === 403) {
      history.push("/account");
    } else if (sucessfullyLoggedIn && loginData?.status_code === 201) {
      localStorage.setItem("isUserLogged", "true");
      history.push("/dashboard");
    } else {
      history.push("/account");
    }
  }, [sucessfullyLoggedIn, loginData, history]);

  return (
    <Layout className="login-layout">
      <Row justify="center">
        <Card className="login-card">
          <Row justify="center">
            <Col xs={4} md={4}>
              <Link to="/">
                <img
                  src="https://kite.zerodha.com/static/images/kite-logo.svg"
                  alt="Kite logo"
                />
              </Link>
            </Col>
          </Row>
          <Typography.Title
            className="login-typography-title"
            level={3}
            align="center"
          >
            Login in NSE
          </Typography.Title>
          <Row justify="center">
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
            >
              <Form.Item name="username" rules={validationRules.username}>
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item name="password" rules={validationRules.password}>
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder={"Password"}
                />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" className="login-form-button">
                  {isLogging ? "Please wait..." : "Login"}
                </Button>
                <div className="login-bottom-section">
                  Don't have an account?{" "}
                  <Link to="/account/sign-up" className="signup-link">
                    SignUp now!
                  </Link>
                </div>
              </Form.Item>
            </Form>
          </Row>
        </Card>
      </Row>
    </Layout>
  );
}

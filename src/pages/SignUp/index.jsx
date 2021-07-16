import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "react-query";
import { Form, Input, Button, Typography, Card, Row, Layout, Col } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

import { requestUserRegister } from "../../services/auth";

import "./style.css";

const validationRules = {
  fullName: [{ required: true, message: "Please input your full name!" }],
  email: [
    { required: true, type: "email", message: "The input is not valid email!" },
  ],
  password: [
    { required: true, message: "Please input your password!" },
    { min: 8, messages: "password must be at least 8 characters " },
  ],
  confirm: [
    {
      required: true,
      message: "Please confirm your password!",
    },
    ({ getFieldValue }) => ({
      validator(_rule, value) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          "The two passwords that you entered do not match!"
        );
      },
    }),
  ],
  acceptTerms: [
    {
      validator: (_, value) =>
        value ? Promise.resolve() : Promise.reject("Should accept agreement"),
    },
  ],
};

export default function SignUp() {
  const history = useHistory();
  const { mutate: registration, isSuccess: successfullyRegistered } =
    useMutation((data) => requestUserRegister(data));

  const onFinish = (values) => {
    const query = {
      FullName: values.fullName,
      Email: values.email,
      Password: values.password,
      Role: "user",
    };
    registration(query);
  };

  React.useEffect(() => {
    if (successfullyRegistered) history.push("/account");
  }, [successfullyRegistered, history]);

  return (
    <Layout className="signUp-layout">
      <Row justify="center">
        <Card className="signup-card">
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
            level={3}
            align="center"
            className="signup-typography-title"
          >
            Register to NSE
          </Typography.Title>
          <Row justify="center">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                acceptTerms: true,
                advertisesEnable: true,
              }}
              onFinish={onFinish}
            >
              <Form.Item name="fullName" rules={validationRules.fullName}>
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>
              <Form.Item name="email" rules={validationRules.email}>
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item name="password" rules={validationRules.password}>
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                rules={validationRules.confirm}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="re-enter"
                />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" className="login-form-button">
                  Sign up
                </Button>
                <div className="signup-bottom-section">
                  Already user?{" "}
                  <Link to="/account" className="login-link">
                    Login here!
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

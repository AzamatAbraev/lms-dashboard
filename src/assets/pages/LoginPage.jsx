import { Form, Button, Checkbox, Input, Flex, message } from "antd";
import PropTypes from "prop-types";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { IS_LOGIN, PASSWORD, USERNAME } from "../../constants";

const LoginPage = ({ setIsLogin }) => {
  const navigate = useNavigate();
  const onFinish = (values) => {
    const { username, password } = values;
    if (username === USERNAME && password === PASSWORD) {
      setIsLogin(true);
      localStorage.setItem(IS_LOGIN, true)
      navigate("/dashboard");
    } else {
      message.error("User not found. Please try again or contact IT department !")
    }
  };
  return (
    <Flex align="center" justify="center" className="login">
      <Form
        className="login-form"
        name="login"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <h1 className="login-title">Login</h1>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 0,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button className="submit-btn" type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

LoginPage.propTypes = {
  setIsLogin: PropTypes.func,
};

export default LoginPage;

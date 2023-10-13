import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button, theme, Modal } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import "./AdminLayout.css";
import { IS_LOGIN } from "../../../constants";
import useScreenSize from "../../../hooks/screenSize";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ setIsLogin }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const screenSize = useScreenSize();
  useEffect(() => {
    if (screenSize <= 650) {
      setCollapsed(true);
    } else {
      setCollapsed(false)
    }
  }, [screenSize]);

  const logout = () => {
    Modal.confirm({
      title: "Do you want to log out ?",
      onOk: () => {
        navigate("/login");
        setIsLogin(false);
        localStorage.removeItem(IS_LOGIN);
      },
    });
  };

  return (
    <Layout>
      <Sider
        className="admin-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <h3 className="admin-logo">{collapsed ? "LMS" : "LMS Admin"}</h3>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={pathname}
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/teachers",
              icon: <VideoCameraOutlined />,
              label: <Link to="/teachers">Teachers</Link>,
            },
            {
              key: "/students",
              icon: <TeamOutlined />,
              label: <Link to="/students">Students</Link>,
            },
            {
              key: "4",
              icon: <LogoutOutlined />,
              label: <Link onClick={logout}>Logout</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          className="admin-header"
          style={{
            padding: 0,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          className="admin-main"
          style={{
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

AdminLayout.propTypes = {
  setIsLogin: PropTypes.func,
};

export default AdminLayout;

import { Suspense, useState } from 'react';
import { Layout, Menu, Avatar, Spin } from 'antd';
import { renderRoutes } from 'react-router-config';
import { UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const Dashboard = ({ route, location, history }) => {
  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0
        }}>
        <div className="mt-2 user-info">
          <Avatar
            size={64}
            src="https://i.pinimg.com/474x/58/36/63/583663b5e293ac71fab5ad283b627320.jpg"
          />
          <span className="mt-3 text-xs font-semibold text-white">Hi, Shivaluma</span>
        </div>

        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
          <Menu.Item
            key="/users"
            onClick={() => {
              history.push('/users');
            }}
            icon={<UserOutlined />}>
            Users
          </Menu.Item>
          <Menu.Item
            key="/matchs"
            onClick={() => {
              history.push('/matchs');
            }}
            icon={<VideoCameraOutlined />}>
            Matches
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <span className="ml-6 text-lg font-semibold">{route.title}</span>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
            minHeight: 'calc(100vh - 88px)'
          }}>
          <div className="site-layout-background" style={{ padding: 24 }}>
            <Suspense fallback={<Spin />}>{renderRoutes(route.routes)}</Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import { request } from "../../utils";

import { Layout, Menu, Breadcrumb} from "antd";
import { Link, Outlet, useLocation} from "react-router-dom";
import { HomeOutlined, AppstoreAddOutlined, BranchesOutlined } from "@ant-design/icons";

import { Content,Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import "./main.scss";

const Main = () => {
  useEffect(() => {
    request.get("/users");
  }, []);
    //  获取当前路径
    const location = useLocation();
    // 判断当前路由是否包含子路由（即判断是否是 /main 下的路径）
    const isChildRoute = location.pathname !== '/main';
    const [nav,setnav] = useState('首页')
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边栏 */}
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          className="site-menu"
          style={{ height: "100%", borderRight: 0,backgroundColor: '#e0f7fa'}}
        >
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/main">首页</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreAddOutlined />}>
            <Link to="product">商品管理</Link>
            
          </Menu.Item>
          <Menu.Item key="3" icon={<BranchesOutlined />}>
            <Link to="kind">商品分类管理</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ minHeight: '100vh' }}>
      {/* 页头 */}
      <Header
        className="site-layout-background"
        style={{
          padding: '0 20px',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="header-title" style={{ margin: 0, fontSize: '24px', color: '#333' }}>商品管理系统</h2>
      </Header>

      {/* 内容区域 */}
      <Content
        style={{
          padding: '24px',
          margin: '16px 0',
          minHeight: 280,
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
          <Breadcrumb.Item>管理系统</Breadcrumb.Item>
        </Breadcrumb>
        {/* 内容 */}
        <Outlet></Outlet>
        {!isChildRoute &&(<div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>欢迎使用管理系统！</h3>
          <p>在这里，你可以管理系统的各项功能。</p>
        </div>)}
      </Content>
    </Layout>
    </Layout>
  );
};

export default Main;

import { useEffect, useState } from "react";
import { request } from "../../utils";

import { Layout, Menu, Breadcrumb, Dropdown, Avatar, Button, MenuProps} from "antd";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HomeOutlined, AppstoreAddOutlined, BranchesOutlined, UserOutlined, PoweroffOutlined, FileTextOutlined } from "@ant-design/icons";
import classNames from 'classnames'
import { Content,Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import "./main.scss";
import { useSelector } from "react-redux";

const Main = () => {
  const navigate = useNavigate()
 

  //  获取当前路径
  const location = useLocation();
  // 判断当前路由是否包含子路由（即判断是否是 /main 下的路径）
  const isChildRoute = location.pathname !== '/main';
  const [nav,setnav] = useState('首页')
  function handleSelect(key: string): void {
      setnav(key)
  }
//获取token
const {token} = useSelector((state: { counter: { token: string } }) => state.counter)
// JWT 的格式是 'header.payload.signature'
     
const base64Url = token.split(".")[1];  // 类型断言为 string// 获取中间的 payload 部分
const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // 替换 URL 安全字符

// 解码 Base64,拿到token携带的用户信息
const decodedPayload = JSON.parse(atob(base64));
localStorage.setItem('userid', decodedPayload.userId)
  useEffect(() => {
    request.get(`/users/${decodedPayload.userId}`);
  }, [decodedPayload]);

    

 
    
    //退出,清除delete
    const deleteToken = () => {
        localStorage.removeItem('token_key');
        localStorage.removeItem('userid');
        navigate('/')
    }
    
    //用户登录头像
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Button type="link" >
                用户信息
              </Button>
            ),
          },
        {
            key: '2',
            label: (
                <Button type="link"  icon={<PoweroffOutlined />} danger onClick={()=>deleteToken()}>
                退出
              </Button>
            ),
          },
        ];
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边栏 */}
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["首页"]}
          className="site-menu"
          style={{ height: "100%", borderRight: 0,backgroundColor: '#e0f7fa'}}
          selectedKeys={[nav]} 
          onSelect={({ key }) => handleSelect(key)}
        >
          <Menu.Item key="首页" icon={<HomeOutlined />}>
            <Link to="/main" onClick={()=>setnav('首页')}>首页</Link>
          </Menu.Item>
          <Menu.Item key="商品管理" icon={<AppstoreAddOutlined />}>
            <Link to="product" onClick={()=>setnav('商品管理')}>商品管理</Link>
            
          </Menu.Item>
          <Menu.Item key="分类管理" icon={<BranchesOutlined />}>
            <Link to="kind" onClick={()=>setnav('分类管理')}>商品分类管理</Link>
          </Menu.Item>
          <Menu.Item key="操作日志" icon={<FileTextOutlined />}>
            <Link to="log" onClick={()=>setnav('操作日志')}>操作日志</Link>
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
        {/* 用户头像与下拉菜单 */}
       {/* 用户头像与下拉菜单 */}
       <Dropdown  trigger={['click']} menu={{items}} >
        <div>
        {/* Avatar头像组件 */}
            <Avatar
              size="large"
              icon={<UserOutlined />}
              style={{ cursor: 'pointer', marginLeft: '10px',backgroundColor: '#87d068' }}
            />
           
            </div>
          </Dropdown>
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
          <Breadcrumb.Item ><Link to="/main" onClick={()=>setnav('首页') } className={classNames({highlighted:nav==='首页'})}>首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item>{nav==='首页' ? '':nav}</Breadcrumb.Item>
        </Breadcrumb>
        {/* 内容 */}
        {<Outlet></Outlet>}
        {!isChildRoute &&(<div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3>欢迎用户{decodedPayload.username}使用管理系统！</h3>
          <p>在这里，你可以管理系统的各项功能。</p>
        </div>)}
      </Content>
    </Layout>
    </Layout>
  );
};

export default Main;

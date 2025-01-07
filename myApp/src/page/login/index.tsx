import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex, message } from "antd";
import Loginimage from "../../assets/Login.jpg";

import { gettoken } from "../../store/modules/Tokenstore";
//导入useNavigate
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginForm } from "../../type";
import { useEffect, useState } from "react";
import axios from "axios";
import { request } from "../../utils";
//import {jwtDecode} from 'jwt-decode';

//登录页
const Login = () => {
  const usenavigate = useNavigate();
  const dispatch = useDispatch();
  const register = () => {
    //跳转到子路由register
    usenavigate("/register");
  };

   // 获取验证码
   const [captchaImage, setCaptchaImage] = useState('');
  const [captchaText, setCaptchaText] = useState('');
   const fetchCaptcha = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/code');
      const { image, text } = response.data;
        // 更新图像和验证码文本状态
        setCaptchaImage(image);
        setCaptchaText(text);
    } catch (error) {
      console.error('获取验证码失败:', error);
    }
  };
 
  const onFinsh =  async (data: LoginForm) => {
    try {
      //验证码验证
      if (data.captcha !== captchaText) {
        message.error('验证码不正确');
        return;
      }

      //获取token
      await dispatch(gettoken(data));
      const token = localStorage.getItem("token_key");
      
      // JWT 的格式是 'header.payload.signature'
      
      const base64Url = token.split(".")[1];  // 类型断言为 string// 获取中间的 payload 部分
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // 替换 URL 安全字符

      // 解码 Base64,拿到token携带的用户信息
      const decodedPayload = JSON.parse(atob(base64));
     
      //将用户信息存储到localStore中
      localStorage.setItem('userid',decodedPayload.userId);
      localStorage.setItem('username',decodedPayload.username);

      message.success("登录成功");
      // 登录成功跳转到主页
      usenavigate("/main");
    } catch (error) {
     
      message.error(`${error.response.data.message}`);
    }
  };

  useEffect(() => {
    request.get("/users");
    fetchCaptcha()
    
  }, []);
//点击图片更新验证码
  const updatecaptcha = async()=>{
    const response = await axios.get('http://localhost:3000/auth/code');
      const { image, text } = response.data;
        // 更新图像和验证码文本状态
        setCaptchaImage(image);
        setCaptchaText(text);
  }
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url(" + Loginimage + ")",
        backgroundSize: "cover",
      }}
    >
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ width: "500px", height: "300px", margin: "auto" }}
        onFinish={onFinsh}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
         name="captcha"
         rules={[{ required: true, message: "请输入验证码!" }]}>
          <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          {/* 验证码图片和输入框在左边 */}
          <Flex align="center" style={{ gap: '1px', flexGrow: 1 }}>
            <img
              src={`data:image/svg+xml;base64,${btoa(captchaImage)}`}
              alt="验证码"
              onClick={updatecaptcha}
              
            />
            <Input
              type="text"
              placeholder="请输入验证码"
              style={{
                width: '120px',
                height: '36px',
                fontSize: '14px',
                borderRadius: '4px',
                borderColor: '#d9d9d9',
              }}
            />
          </Flex>

          {/* 按钮在右边 */}
          <Button
            type="primary"
            onClick={() => register()}
            style={{
              width: '100px',
              height: '36px',
              fontSize: '14px',
              marginLeft: '10px',
            }}
          >
            注册
          </Button>
        </Flex>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登 录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Login;

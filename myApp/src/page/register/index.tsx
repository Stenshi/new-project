import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button,  Flex,  Form, Input, message } from "antd";
import Loginimage from "../../assets/Login.jpg";
import { useNavigate } from "react-router-dom";

import { registerAPI } from "../../api/register";
import axios from "axios";
import { useEffect, useState } from "react";

//注册页
const Register = () => {

    const usenavigate = useNavigate()
    // 获取验证码
   const [captchaImage, setCaptchaImage] = useState('');
   const [captchaText, setCaptchaText] = useState('');
    const fetchCaptcha = async () => {
     try {
       const response = await axios.get('http://localhost:3000/users/code');
       const { image, text } = response.data;
         // 更新图像和验证码文本状态
         setCaptchaImage(image);
         setCaptchaText(text);
     } catch (error) {
       console.error('获取验证码失败:', error);
     }
   };
    const onfinsh = async (value)=>{
      //验证码验证
      if (value.captcha !== captchaText) {
        message.error('验证码不正确');
        return;
      }

        try{
         await registerAPI(value)
         message.success('注册成功')
         // 注册成功跳转到Login页
         usenavigate('/');
        }catch(error){
          
          message.error(`${error.response.data.message}`)
         }
        
          
       
        
    }

    useEffect(() => {
      fetchCaptcha()
    }, []);

    //点击图片更新验证码
  const updatecaptcha = async()=>{
    fetchCaptcha()
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
        name="register"
        initialValues={{ remember: true }}
        style={{ width: "500px", height: "300px", margin: "auto" }}
        onFinish={onfinsh}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "请输入你的用户名!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { 
            required: true,
            message:  "请输入你的密码!" },
            {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
                message:  "密码由大小写字母，数字和特殊字符组成，并且不少于4位!" 
            }
        ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "请确认你的密码!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("您输入的新密码不匹配!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>
        
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "请输入你的邮件!" },
            //必须为email格式
            { 
              type: 'email', 
              message: "请输入正确的email!" 
            }
           
        ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
        name="captcha"
        rules={[{ required: true, message: "请输入验证码!" }]}>
        
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          {/* 验证码图片和输入框紧挨着在左边 */}
          <Flex align="center" style={{ gap: '1px', flexGrow: 1 }}>
            <img
              src={`data:image/svg+xml;base64,${btoa(captchaImage)}`}
              alt="验证码"
              onClick={updatecaptcha}
              style={{
                cursor: 'pointer',
                borderRadius: '4px', // 圆角
              }}
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
            block 
            type="primary"
             htmlType="submit"
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
      </Form>
    </div>
  );
};
export default Register;



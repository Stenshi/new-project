import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button,  Form, Input, message } from "antd";
import Loginimage from "../../assets/Login.jpg";
import { useNavigate } from "react-router-dom";

import { registerAPI } from "../../api/register";

//注册页
const Register = () => {
    const usenavigate = useNavigate()
    const onfinsh = async (value)=>{
        try{
         await registerAPI(value)
         message.success('注册成功')
         // 注册成功跳转到Login页
         usenavigate('/');
        }catch(error){
          
          message.error(`${error.response.data.message}`)
         }
        
          
       
        
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
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { 
            required: true,
            message:  "Please input your Password!" },
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
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
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
            { required: true, message: "Please input your Email!" },
            //必须为email格式
            { 
              type: 'email', 
              message: "请输入正确的email!" 
            }
           
        ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;



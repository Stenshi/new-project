import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex, message } from 'antd';
import Loginimage from '../../assets/Login.jpg'

import { gettoken } from '../../store/modules/Tokenstore';
//导入useNavigate
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { LoginForm } from '../../type';

//登录页
const Login = ()=>{
    const usenavigate = useNavigate();
    const dispatch = useDispatch()
    const register=()=>{
        //跳转到子路由register
        usenavigate('/register');
    }
   
    const onFinsh = async (data:LoginForm)=>{
      try{
        await dispatch(gettoken(data))
        message.success('登录成功')
        // 注册成功跳转到主页
        usenavigate('/main');
       }catch(error){
        console.log(error);
         message.error(`${error.response.data.message}`)
        }
    }
    return (
        
        <div style={{ 
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url(' + Loginimage + ')',
            backgroundSize: 'cover',
            
          }}>
            
            <Form
            name="login"
            initialValues={{ remember: true }}
            style={{ width:'500px',height:'300px',margin:'auto'}}
            onFinish={onFinsh}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Button >验证码</Button>
                    {/*编程式跳转 */}
                    <Button onClick={()=>register()}>注册</Button>
                </Form.Item>
              </Flex>
            </Form.Item>
      
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
          </div>
    )
}
export default Login
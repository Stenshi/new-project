//用户相关的所有请求
import { RegisterForm } from "../type"
import { request } from "../utils"
//1.注册请求
function registerAPI(value:RegisterForm){
    return request({
        url: '/users/register',
        method: 'POST',
        data:{
          username:value.username,
          password:value.password,
          email:value.email
        }
    })
}
export {registerAPI}
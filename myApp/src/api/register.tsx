//用户相关的所有请求
import { request } from "../utils"
//1.登录请求
function registerAPI(value){
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
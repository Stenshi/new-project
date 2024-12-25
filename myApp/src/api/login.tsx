//用户相关的所有请求
import { loginrequest  } from "../utils"
interface LoginForm {
    username: string;
    password: string;
  }
//1.登录请求
function loginAPI(formData:LoginForm ){
    return loginrequest ({
        url: '/auth/login',
        method: 'POST',
        //post传入的参数值
        data: formData
    })
}
export {loginAPI}
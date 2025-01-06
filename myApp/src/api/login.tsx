//用户相关的所有请求
import { LoginForm } from "../type"
import { loginrequest  } from "../utils"

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
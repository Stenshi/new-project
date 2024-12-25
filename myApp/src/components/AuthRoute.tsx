import { getToken } from "../utils";
import { Navigate } from "react-router-dom";
const AuthRoute = ({children})=>{
    const token = getToken()
    if(token){
        // 父子嵌套children属性
        //<></>不会格外渲染dom元素，就只渲染children
        return <>{children}</>
    }else{
        // Navigate对页面重定向
        return <Navigate to = {'/'}></Navigate>
    }
}
export default AuthRoute
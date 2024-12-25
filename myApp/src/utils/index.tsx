//注入axios请求
import loginrequest from "./login_request";
import request from "./request";
import { getToken, removeToken, setToken } from "./token";

//统一导出
export {
    request,
    loginrequest,
    getToken,
    setToken,
    removeToken
}
//axios的封装处理

import axios from "axios";
import { getToken, removeToken } from "./token";
import router from "../router";

//1.根域名配置

const request = axios.create({

  //配置根域名

  baseURL: 'http://localhost:3000',

  //2.超时时间

  timeout: 10000,

})

//请求拦截器
request.interceptors.request.use(
  (config) => {
    // 请求发出前的处理

    // 如果请求方法是 POST 或 PUT 且 data 存在
    if (config.data) {
      // 将数据转为 JSON 格式
      config.data = JSON.stringify(config.data);
      // 确保设置 Content-Type 为 application/json
      config.headers['Content-Type'] = 'application/json';
    }

    //操作这个config，注入token数据
    //1.获取到token
    const token = getToken()
    //2.按照后端的格式要求对token进行拼接，例如token前面要加一个Bearer空格
    if(token){
        //如果token存在，给请求头传入token
        // config.headers.Authorization这是固定格式
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
  },
  (error) => {
    // 请求失败时的处理
    return Promise.reject(error);
  }
);

// 添加响应拦截器
//在响应返回到客户端之前，做拦截，然后做一些操作，重点是处理返回的数据
request.interceptors.response.use((response)=> {
 
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error)=> {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  //监控401 token
  console.log(error);
  if(error.response.status===401){
    //清除Token值
    removeToken('Key_id')
    removeToken('user_id')
    //跳转到登录页
    //因为Hook函数usenavigate只能在组件中使用，所以要用导出的路由实例router然后navigate跳转使用
    router.navigate('/')
    //解决要手动刷新才能跳转到登陆页面问题
    //强制刷新
    window.location.reload()
  }
  return Promise.reject(error)
})

export default request

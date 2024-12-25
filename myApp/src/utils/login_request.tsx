//axios的封装处理

import axios from "axios";
import { getToken } from "./token";


//1.根域名配置

const loginrequest = axios.create({

  //配置根域名

  baseURL: 'http://localhost:3000',

  //2.超时时间

  timeout: 10000,

})

//请求拦截器
loginrequest.interceptors.request.use(
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
export default loginrequest
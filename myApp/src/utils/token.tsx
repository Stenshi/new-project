//token命名
// eslint-disable-next-line react-refresh/only-export-components
const TOKENKEY  = 'token_key';

//设置token
const setToken = (token:string)=>{
    localStorage.setItem(TOKENKEY,token);
} 
//获取token
const getToken = ()=>{
    return localStorage.getItem(TOKENKEY)
}
// 移除token
const removeToken = (TOKENKEY:string)=>{
    localStorage.removeItem(TOKENKEY)
}

export {setToken, getToken, removeToken}
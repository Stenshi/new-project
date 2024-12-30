//和用户相关的状态管理
import {  createSlice } from "@reduxjs/toolkit";

//导入封装好的axios请求=>request
import { getToken, setToken } from "../../utils";
import { loginAPI } from "../../api/login";
import { AppDispatch } from "..";
import { LoginForm } from "../../type";



const userToken = createSlice({
    name: 'user',
    initialState:{
        //从localStorage中获取token，如果没有，就用空字符串代替
        token: getToken() || ''
    },
    reducers:{
        settoken(state,action){
            state.token = action.payload
            //token存入到localStorage
            setToken(action.payload)
        }
    }

})

//导出setoken方法
const {settoken} = userToken.actions;
const gettoken = (loginForm:LoginForm )=>{
    return (
        async (dispatch:AppDispatch)=>{
                const res = await loginAPI(loginForm);
                dispatch(settoken(res.data.accessToken)); // 调用 settoken action
        }
    )   

} 

const  TokenReducer = userToken.reducer;

// eslint-disable-next-line react-refresh/only-export-components
export {gettoken} 

export default TokenReducer;
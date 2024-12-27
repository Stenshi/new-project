import { configureStore } from "@reduxjs/toolkit";
//导入子模块reducer,起一个名字
import TokenReducer from "./modules/Tokenstore";
import { thunk } from "redux-thunk";




//组合子模块，组合成一个跟模块
const store = configureStore({
    reducer:{
        //组合子模块reducer
        counter:TokenReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
    
})

//导出根store
export default store

export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";
//导入子模块reducer,起一个名字
import TokenReducer from "./modules/Tokenstore";

//组合子模块，组合成一个跟模块
const store = configureStore({
    reducer:{
        //组合子模块reducer
        counter:TokenReducer
    }
})

//导出根store
export default store
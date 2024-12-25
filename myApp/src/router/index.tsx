//引入page页
import Login from "../page/login";
import Register from "../page/register";

//导入createBrowserRouter方法

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Main from "../page/main";
import AuthRoute from "../components/AuthRoute";
// 创建router实例
const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>,
        children: [
            {
                index:true,
                element: <Login/>
            },
            {
                path: '/register',
                element: <Register/>
            }
        ]  
    },
    {
        path: '/main',
        element: <AuthRoute><Main/></AuthRoute>
    }
    
])

export default router;



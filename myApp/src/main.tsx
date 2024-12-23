
import { createRoot } from 'react-dom/client'
import './index.css'
//导入RouterProvider组件
import { RouterProvider } from 'react-router-dom'
//导入router路由
import router from './router'


import 'normalize.css'
createRoot(document.getElementById('root')!).render(
  //路由绑定
  <RouterProvider router={router}>
    
  </RouterProvider>
)

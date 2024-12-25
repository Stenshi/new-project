
import { createRoot } from 'react-dom/client'
import './index.css'
//导入RouterProvider组件
import { RouterProvider } from 'react-router-dom'
//导入router路由
import router from './router'
//导入react-redux方法
import { Provider } from'react-redux'
//导入跟组件
import store from './store'

import 'normalize.css'

createRoot(document.getElementById('root')!).render(
  // 注入store数据成功
  <Provider store={store}>
  {/* 路由绑定 */}
  <RouterProvider router={router}>

  </RouterProvider>
  </Provider>
)

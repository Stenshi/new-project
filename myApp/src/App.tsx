import React from 'react';
import { Outlet } from 'react-router-dom';
const App: React.FC = () => {
 

  return (
    <>
    {/* 引入子路由 */}
    <Outlet></Outlet>
    </>
  );
};

export default App;
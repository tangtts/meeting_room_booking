import { UserOutlined } from '@ant-design/icons'
import { Flex, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
function App() {
  return (
    <Flex vertical gap={20}>
      <Flex justify='space-between'>
        <h1>会议室预定系统-后台管理</h1>
        <Link to="/user/info_modify">
        <UserOutlined style={{fontSize:'40px'}} />
          </Link> 
      </Flex>
      <Outlet></Outlet>
    </Flex>
  )
}

export default App

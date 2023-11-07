import { Menu as AntdMenu, MenuProps, Flex, Row, Col } from "antd";
import { Outlet, useNavigate } from "react-router-dom";


export default function Menu() {

  const navigate = useNavigate()
  const handleMenuItemClick = (info: any) => {
    let path = '';
    switch (info.key) {
      case '1':
        path = '/meeting_room_manage';
        break;
      case '2':
        path = '/booking_manage';
        break;
      case '3':
        path = '/user_manage';
        break;
      case '4':
        path = '/statistics';
        break;
    }
    navigate(path);
  }


  function getSelectedKeys() {
    const pathname = location.pathname;
    if (pathname === '/meeting_room_manage') {
      return ['1'];
    } else if (pathname === '/booking_manage') {
      return ['2'];
    } else if (pathname === '/user_manage') {
      return ['3'];
    } else if (pathname === '/statistics') {
      return ["4"]
    }
  }


  const items: MenuProps['items'] = [
    {
      key: '1',
      label: "会议室管理"
    },
    {
      key: '2',
      label: "预定管理"
    },
    {
      key: '3',
      label: "用户管理"
    },
    {
      key: '4',
      label: "统计"
    }
  ];
  return (
    <Row gutter={4}>
      <Col span={4}>
        <AntdMenu
          defaultSelectedKeys={getSelectedKeys()}
          items={items}
          onClick={handleMenuItemClick}
        />
      </Col>

      <Col span={20}>
        <Outlet></Outlet>
      </Col>

    </Row>
  )
}
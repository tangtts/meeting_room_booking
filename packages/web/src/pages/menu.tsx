import { Menu as AntdMenu, MenuProps, Flex, Row, Col } from "antd";
import { Outlet } from "react-router-dom";


export default function Menu() {
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
          defaultSelectedKeys={['3']}
          items={items}
        />
      </Col>
      <Col span={20}>
        <Outlet></Outlet>
      </Col>
    </Row>
  )
}
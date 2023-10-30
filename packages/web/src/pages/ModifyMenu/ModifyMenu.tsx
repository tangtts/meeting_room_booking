import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu as AntdMenu, Flex, MenuProps } from 'antd';

const items: MenuProps['items'] = [
    {
        key: '1',
        label: "信息修改"
    },
    {
        key: '2',
        label: "密码修改"
    }
];



export function ModifyMenu() {
    const navigate = useNavigate()
    const location = useLocation()
    const handleMenuItemClick = (info: any) => {
        if (info.key === '1') {
            navigate('info_modify')
        } else {
            navigate('password_modify')
        }
    }

    return <Flex id="menu-container">
        <div className="menu-area">
            <AntdMenu
                defaultSelectedKeys={location.pathname === '/user/info_modify' ? ['1'] : ['2']}
                items={items}
                onClick={handleMenuItemClick}
            />
        </div>
        <div className="content-area">
            <Outlet></Outlet>
        </div>
    </Flex>
}

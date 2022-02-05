import './index.scss';

import { ReactElement } from 'react';
import { Location, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';
import { appRouters, RouteObject } from "../Router/router.config";

const { Sider } = Layout;
const { SubMenu } = Menu;

interface ISiderMenuProps {
  location: Location;
}


const SiderMenu = ({ location }: ISiderMenuProps): ReactElement => {
  const defaultSelectedKeys = location.pathname;

  const menuItems = appRouters
  .filter((item: RouteObject) => item.isLayout)
  .map((route: RouteObject) => 
      (
          <Menu.Item key={route.path} icon={<ApartmentOutlined />}>
              <Link to={route.path}>
                  <span>{route.title}</span>
              </Link>
          </Menu.Item>
      )
  );

  return (
    <Sider width={300} className="site-layout-background">
      <Menu 
        mode="inline"
        defaultSelectedKeys={[ defaultSelectedKeys ]}
        style={{ height: '100%', borderRight: 0 }}
      >
        {menuItems}
      </Menu>
    </Sider>
  );
};

export default SiderMenu;
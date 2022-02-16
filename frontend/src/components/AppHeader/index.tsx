import './index.scss';

import { ReactElement } from 'react';
import { Link, Location } from 'react-router-dom';
import { routers, RouteObject } from '../Router/router.config';
import { Menu, Layout } from 'antd';

const { Header } = Layout;

interface IAppHeaderProps {
  location: Location;
}

const AppHeader = ({ location }: IAppHeaderProps): ReactElement => {
  const defaultSelectedKeys = location.pathname;

  const menuItems = routers
    .filter((item: RouteObject) => item.showInMenu)
    .map((route: RouteObject) => (
      <Menu.Item key={route.path}>
        <Link to={route.path}>
          <span>{route.title}</span>
        </Link>
      </Menu.Item>
    ));

  return (
    <Header className="header">
      <div className="header__logo">
        <span className="name">Tapira</span>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[defaultSelectedKeys]}
      >
        {menuItems}
      </Menu>
    </Header>
  );
};

export default AppHeader;

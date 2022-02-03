import './index.scss';

import React from 'react';
import { FC, ReactElement } from 'react';
import { Location, NavigateFunction } from 'react-router-dom';
import { 
  Avatar,
  Col,
  Layout, 
  Menu 
} from 'antd';
import { appRouters } from "../Router/router.config";
import { Utils } from '../../utils/utils';

const { Sider } = Layout;

export interface ISiderMenuProps {
  collapsed: boolean;
  onCollapse: any;
  location: Location;
  navigate: NavigateFunction;
}

const SiderMenu = ({collapsed, onCollapse, location, navigate}: ISiderMenuProps): ReactElement => {

  const currentRoute = Utils.getRoute(location.pathname);

  return (
    <div></div>
    // <Sider trigger={null} className="sidebar" width={256} collapsible collapsed={collapsed} onCollapse={onCollapse}>
    //   {collapsed ? (
    //     <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
    //       {/* <Avatar shape="square" style={{ height: 30, width: 64 }} src={src for logo} /> */}
    //     </Col>
    //   ) : (
    //     <Col style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>
    //       {/* <Avatar shape="square" style={{ height: 70, width: 128 }} src={src for logo} /> */}
    //     </Col>
    //   )}

    //   <Menu theme="dark" mode="inline" selectedKeys={[currentRoute ? currentRoute.path : '']}>
    //     {appRouters
    //       .filter((item: any) => !item.isLayout && item.showInMenu)
    //       .map((route: any, index: number) => {
    //         return (
    //           <Menu.Item key={route.path} onClick={() => navigate(route.path)}>
    //             <route.icon />
    //             <span>{route.title}</span>
    //           </Menu.Item>
    //         );
    //       })}
    //   </Menu>
    // </Sider>
  );
};

export default SiderMenu;
import './index.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Badge, Col, Dropdown, Menu, Row } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';

export interface IHeaderProps {
    collapsed?: any;
    toggle?: any;
}

const userDropdownMenu = (
    <Menu>
        <Menu.Item key="2">
            <Link to="/logout">
                <LogoutOutlined />
                <span>Logout</span>
            </Link>
        </Menu.Item>
  </Menu>
);

export class Header extends React.Component<IHeaderProps> {
    render() {
        return (
            <Row className={'header-container'}>
                <Col style={{ textAlign: 'left' }} span={12}>
                {this.props.collapsed ? (
                    <MenuUnfoldOutlined className="trigger" onClick={this.props.toggle} />
                ) : (
                    <MenuFoldOutlined className="trigger" onClick={this.props.toggle} />
                )}
                </Col>
                <Col style={{ padding: '0px 15px 0px 15px', textAlign: 'right' }} span={12}>
                    <Dropdown overlay={userDropdownMenu} trigger={['click']}>
                        <Badge style={{}} count={3}>
                            {/* <Avatar style={{ height: 24, width: 24 }} shape="circle" alt={'profile'} src={profilePicture} /> */}
                        </Badge>
                </Dropdown>
                </Col>
            </Row>
        );
    }
}

export default Header;
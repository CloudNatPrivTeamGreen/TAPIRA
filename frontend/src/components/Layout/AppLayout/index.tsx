import './index.scss';

import React, { useState } from 'react';

import { useLocation, useNavigate  } from 'react-router-dom';


import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import Footer from "../../Footer";
import Header from "../../Header";
import SiderMenu from "../..//SiderMenu";
import AppRouter from '../../Router';
import { Utils} from '../../../utils/utils';

const { Content } = Layout;

const AppLayout = (props: any) => {

  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed((preVal) => !preVal);
  }

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(() => collapsed);
  }

  const navigate = useNavigate();
  const location = useLocation();

  const layout = (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu onCollapse={onCollapse} collapsed={collapsed} navigate={navigate} location={location} />
      <Layout>
        <Layout.Header style={{ background: '#fff', minHeight: 52, padding: 0 }}>
          <Header collapsed={collapsed} toggle={toggle} />
        </Layout.Header>
        <Content style={{ margin: 16 }}>
          <AppRouter />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );

  return <DocumentTitle title={Utils.getPageTitle(location.pathname)}>{layout}</DocumentTitle>;
}

export default AppLayout;
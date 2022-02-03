import './index.scss';

import { useLocation } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Layout } from 'antd';
import AppFooter from "../../AppFooter";
import AppHeader from "../../AppHeader";
import SiderMenu from "../..//SiderMenu";
import AppRouter from '../../Router';
import { Utils} from '../../../utils/utils';

const { Content } = Layout;

const AppLayout = (props: any) => {

  const location = useLocation();

  const layout = (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader location={location}/>
      <Layout>
        <SiderMenu location={location}/>
        <Layout>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }} 
          >
            <AppRouter />
          </Content>
        </Layout>
        <AppFooter />
      </Layout>
    </Layout>
  );

  return <DocumentTitle title={Utils.getPageTitle(location.pathname)}>{layout}</DocumentTitle>;
}

export default AppLayout;
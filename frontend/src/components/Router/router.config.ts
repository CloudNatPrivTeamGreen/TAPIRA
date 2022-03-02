import {
  ApartmentOutlined,
  DeleteRowOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import LoadableComponent from '../Loadable';

export enum RoutingParameters {
  ServiceName = ':serviceName',
  Version = ':version',
  Context = ':context',
}

export enum RoutePaths {
  Services = '/',
  Service = '/service/:serviceName/:version',
  CompareSpecs = '/compare/:serviceName/:context',
  Evolution = '/evolution/:serviceName',
  Conflicts = '/conflicts',
  Reports = '/reports',
}

/**
 * RoutesForTesting are just for the purpose of testing
 * When not required need to be taken out
 */
export enum RoutesForTesting {
  EvolutionTestPage = '/evolution_test/:serviceName',
  ReportsTestPage = '/reports_test',
}

export interface RouteObject {
  path: string;
  exact: boolean;
  name: string;
  title: string;
  component: any;
  showInMenu: boolean;
  permission?: string;
  icon?: any;
}

export const appRouters: RouteObject[] = [
  {
    path: RoutePaths.Services,
    exact: true,
    name: 'services',
    title: 'Services',
    component: LoadableComponent(() => import('../../scenes/ServicesListPage')),
    showInMenu: true,
    icon: ApartmentOutlined,
  },
  {
    path: RoutePaths.Service,
    exact: true,
    name: 'service spec view',
    title: 'Service Spec Version View',
    component: LoadableComponent(
      () => import('../../scenes/ServiceSpecVersionView')
    ),
    showInMenu: false,
  },
  {
    path: RoutePaths.CompareSpecs,
    exact: true,
    name: 'compare service specs',
    title: 'Compare Service Specs',
    component: LoadableComponent(() => import('../../scenes/CompareSpecsPage')),
    showInMenu: false,
  },
  {
    path: RoutePaths.Evolution,
    exact: true,
    name: 'evolution',
    title: 'Evolution',
    component: LoadableComponent(() => import('../../scenes/EvolutionPage')),
    showInMenu: false,
  },
  {
    path: RoutePaths.Conflicts,
    exact: true,
    name: 'conflicts',
    title: 'Conflicts',
    component: LoadableComponent(() => import('../../scenes/ConflictsPage')),
    showInMenu: true,
    icon: DeleteRowOutlined,
  },
];

/**
 * testRouters are just for the purpose of testing
 * When not required need to be taken out
 */
export const testRouters: RouteObject[] = [
  {
    path: RoutesForTesting.EvolutionTestPage,
    exact: true,
    name: 'evolution test',
    title: 'Evolution Test',
    component: LoadableComponent(
      () => import('../../scenes/pages_for_testing/EvolutionTestPage')
    ),
    showInMenu: false,
  },
  {
    path: RoutesForTesting.ReportsTestPage,
    exact: true,
    name: 'report test',
    title: 'Report Test',
    component: LoadableComponent(
      () => import('../../scenes/pages_for_testing/ReportsTestPage')
    ),
    showInMenu: true,
    icon: BarsOutlined,
  },
];

export const routers = [...appRouters, ...testRouters];

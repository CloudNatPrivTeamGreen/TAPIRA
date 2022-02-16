import {
  ApartmentOutlined,
  DeleteRowOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import LoadableComponent from '../Loadable';

export enum RoutingParameters {
  ServiceName = ':serviceName',
  Version = ':version',
}

export enum RoutePaths {
  Services = '/',
  Service = '/service/:serviceName/:version',
  CompareSpecs = '/compare/:serviceName',
  Evolution = '/evolution/:serviceName',
  Conflicts = '/conflicts',
  Reports = '/reports',
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
  {
    path: RoutePaths.Reports,
    exact: true,
    name: 'reports',
    title: 'Reports',
    component: LoadableComponent(() => import('../../scenes/ReportsPage')),
    showInMenu: true,
    icon: BarsOutlined,
  },
];

export const routers = [...appRouters];

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
}

export interface RouteObject {
  path: string;
  exact: boolean;
  name: string;
  title: string;
  component: any;
  isLayout: boolean;
  showInMenu: boolean;
  permission?: string;
}

export const appRouters: RouteObject[] = [
  {
    path: RoutePaths.Services,
    exact: true,
    name: 'services',
    title: 'Services',
    component: LoadableComponent(() => import('../../scenes/ServicesListPage')),
    isLayout: true,
    showInMenu: true,
  },
  {
    path: RoutePaths.Service,
    exact: true,
    name: 'service spec view',
    title: 'Service Spec Version View',
    component: LoadableComponent(
      () => import('../../scenes/ServiceSpecVersionView')
    ),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: RoutePaths.CompareSpecs,
    exact: true,
    name: 'compare service specs',
    title: 'Compare Service Specs',
    component: LoadableComponent(() => import('../../scenes/CompareSpecsPage')),
    isLayout: false,
    showInMenu: false,
  },
  {
    path: RoutePaths.Evolution,
    exact: true,
    name: 'evolution',
    title: 'Evolution',
    component: LoadableComponent(() => import('../../scenes/EvolutionPage')),
    isLayout: false,
    showInMenu: false,
  },
];

export const routers = [...appRouters];

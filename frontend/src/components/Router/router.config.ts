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
  Conflicts = 'conflicts',
}

export interface RouteObject {
  path: string;
  exact: boolean;
  name: string;
  title: string;
  component: any;
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
  },
];

export const routers = [...appRouters];

import LoadableComponent from "../Loadable";

export enum RoutingParameters {
    ServiceName = ':serviceName',
    Version = ':version'
}

export enum RoutePaths {
    Services = '/',
    Service = '/service/:serviceName',
    ServiceSpecVersionView = '/service/:serviceName/:version'
    CompareSpecs = '/service/compare/:serviceName'
}

export interface RouteObject {
    path: string;
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
        name: 'services',
        title: 'Services',
        component: LoadableComponent(() => import('../../scenes/ServicesListPage')),
        isLayout: true,
        showInMenu: true
    },
    {
        path: RoutePaths.Service,
        name: 'service',
        title: 'Service',
        component: LoadableComponent(() => import('../../scenes/ServicePage')),
        isLayout: false,
        showInMenu: false,
    },
    {
        path: RoutePaths.ServiceSpecVersionView,
        name: 'service spec view',
        title: 'Service Spec Version View',
        component: LoadableComponent(() => import('../../scenes/ServiceSpecVersionView')),
        isLayout: false,
        showInMenu: false
    },
    {
        path: RoutePaths.CompareSpecs,
        exact: true,
        name: 'compare service specs',
        title: 'Compare Service Specs',
        component: LoadableComponent(() => import('../../scenes/CompareSpecsPage')),
        isLayout: false,
        showInMenu: false,
    }
]

export const routers = [...appRouters];
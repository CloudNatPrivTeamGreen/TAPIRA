import LoadableComponent from "../Loadable";

export enum RoutingParameters {
    ServiceName = ':serviceName'
}

export enum RoutePaths {
    Services = '/',
    Service = '/service/:serviceName'
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
        component: LoadableComponent(() => import('../../scenes/TapiraServicesList')),
        isLayout: true,
        showInMenu: true
    },
    {
        path: RoutePaths.Service,
        exact: true,
        name: 'service',
        title: 'Service',
        component: LoadableComponent(() => import('../../scenes/TapiraService')),
        isLayout: false,
        showInMenu: false,
    },
]

export const routers = [...appRouters];
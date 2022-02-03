import LoadableComponent from "../Loadable";

interface RouteObject {
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
        path:'/',
        exact: true,
        name: 'services',
        title: 'Services',
        component: LoadableComponent(() => import('../../scenes/TapiraServicesList')),
        isLayout: false,
        showInMenu: true
    },
    {
        path: '/service',
        exact: true,
        name: 'service',
        title: 'Service',
        component: LoadableComponent(() => import('../../scenes/TapiraService')),
        isLayout: true,
        showInMenu: false,
    },
]

export const routers = [...appRouters];
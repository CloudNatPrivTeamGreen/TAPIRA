import { routers } from "../components/Router/router.config";

export abstract class Utils {
    public static getRoute(path: string): any {
        return routers.find(route => route.path === path);
    }

    public static getPageTitle(path: string): string {
        const route = routers.find(routeItem => routeItem.path === path);
        const AppName = 'Tapira';
        if (!route) {
            return AppName;
        }

        return `${route.title} | ${AppName}`
    }
}
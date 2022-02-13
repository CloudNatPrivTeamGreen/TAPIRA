import { routers } from '../components/Router/router.config';

export abstract class Utils {
  public static getRoute(path: string): any {
    return routers.find((route) => route.path === path);
  }

  public static getPageTitle(path: string): string {
    const route = routers.find((routeItem) => routeItem.path === path);
    const AppName = 'Tapira';
    if (!route) {
      return AppName;
    }

    return `${route.title} | ${AppName}`;
  }

  public static nameof = <T>(name: Extract<keyof T, string>): string => name;

  public static capitalizePropertyName(str: string): string {
    const arr = str.split('_');

    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    return arr.join(' ');
  }
}

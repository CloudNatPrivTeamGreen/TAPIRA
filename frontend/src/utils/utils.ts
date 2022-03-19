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

  public static uuidv4() {
    return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c) =>
      (
        ((Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0]) & 15) >>
        (Number(c) / 4)
      ).toString(16)
    );
  }

  public static flattenObject(obj: any): any {
    let result = {};

    for (const i in obj) {
      if (
        typeof obj[i] === 'object' &&
        !Array.isArray(obj[i]) &&
        obj[i] !== null
      ) {
        const temp = Utils.flattenObject(obj[i]);
        for (const j in temp) {
          result[i + '.' + j] = temp[j];
        }
      } else {
        result[i] = obj[i];
      }
    }
    return result;
  }

  public static sortObjectKeys(
    obj: any,
    sortFunc: (key1: string, key2: string) => number
  ): Array<string> {
    return Object.keys(obj).sort(sortFunc);
  }
}

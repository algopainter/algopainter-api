/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Helpers {
  static distinctBy(keyProps: string[], arr: any[]): any[] {
    const map = new Map<string, any>();
    arr.forEach(entry => {
      const key = keyProps.map(k => entry[k]).join('|');
      map.set(key, entry);
    });
    return Array.from(map.values());
  }
}
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class Helpers {
  static distinctBy<TT>(keyProps: string[], arr: TT[]): TT[] {
    const map = new Map<string, TT>();
    (arr as any[]).forEach(entry => {
      const key = keyProps.map(k => entry[k]).join('|');
      map.set(key, entry);
    });
    return Array.from(map.values());
  }
}

export interface IKeyPair<TValue> {
  [name: string]: TValue
}
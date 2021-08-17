import { IFilter, IOrderBy } from "../services/base.service";

export default class QueryParser {
  static parseByPrefix(prefix: string, object: any) : IFilter | IOrderBy {
    const newObject: any = {};
    Object.keys(object).forEach(key => {
      if(key.includes(prefix)) {
        newObject[key.replace(`${prefix}.`, '')] = object[key];
      }
    });
    return newObject;
  }

  static parseExcludePrefix(prefix: string, object: any) : IFilter | IOrderBy {
    const newObject: any = {};
    Object.keys(object).forEach(key => {
      if(!key.includes(prefix)) {
        newObject[key] = object[key];
      }
    });
    return newObject;
  }
}


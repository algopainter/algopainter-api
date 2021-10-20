/* eslint-disable @typescript-eslint/no-explicit-any */
import Paged from "../shared/paged";
import Result from "../shared/result";
/// <reference types="../../typings/mongo-querystring" />
import MongoQS from 'mongo-querystring'
export abstract class BaseService {
  /**
   * Translate a filter to mongo query
   * @param filter 
   * @returns 
   */
  translateToMongoQuery(filter: IFilter): IFilter {
    const qs = new MongoQS();
    const query = Object.keys(filter).length ? qs.parse(filter) : null;
    for (let index = 0; index < Object.keys(filter).length; index++) {
      if(filter[Object.keys(filter)[index]]?.startsWith('0x')) { //is a Hash
        query[Object.keys(filter)[index]] = filter[Object.keys(filter)[index]];
      }
    }
    return query;
  }

  /**
   * Translate an orederby to a mongo sort object
   * @param order 
   * @returns 
   */
  translateToMongoOrder(order: IOrderBy | null, defaultOrder : any = { createdAt: -1 }): unknown {
    if (order)
      return Object.keys(order).length ? order : defaultOrder;
    return defaultOrder;
  }
}

/**
 * Used to create concrete services
 */
export abstract class BaseCRUDService<T> extends BaseService {
  abstract listAsync(filter: IFilter | null, order: IOrderBy | null)
    : Promise<Result<T[]>>;

  abstract pagedAsync(filter: IFilter | null, order: IOrderBy | null, page: number | null, perPage: number | null)
    : Promise<Result<Paged<T>>>;

  abstract getAsync(id: string)
    : Promise<Result<T>>;

  abstract createAsync(createdItem: T)
    : Promise<Result<T>>;

  abstract updateAsync(id: string, updatedItem: T)
    : Promise<Result<T>>;
}

export interface IFilter {
  [name: string]: string | any | undefined
}

export interface IOrderBy {
  [name: string]: string | undefined
}
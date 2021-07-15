import Paged from "../shared/paged";
import Result from "../shared/result";

/**
 * Used to create concrete services
 */
export default abstract class BaseService<T> {
  abstract listAsync(filter: IFilter | null, order: IOrderBy | null) 
    : Promise<Result<T[]>>;
  
  abstract pagedAsync(filter: IFilter | null, order: IOrderBy | null, page: number | null, perPage: number | null)
    : Promise<Result<Paged<T>>>;
  
  abstract getAsync(filter: IFilter | null)
    : Promise<Result<T>>;
  
  abstract createAsync(createdItem: T)
    : Promise<Result<T>>;
  
  abstract updateAsync(updatedItem: T) 
    : Promise<Result<T>>;
}

export interface IFilter {
  [name: string]: string | undefined
}

export interface IOrderBy {
  [name: string]: string | undefined
}
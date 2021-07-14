import Result from "../shared/result";

/**
 * Used to create concrete services
 */
export default abstract class BaseService<T> {
  abstract listAsync() : Promise<Result<T[]>>;
  abstract getAsync(uid: string) : Promise<Result<T>>;
  abstract createAsync(createdItem: T) : Promise<Result<T>>;
  abstract updateAsync(updatedItem: T) : Promise<Result<T>>;
}
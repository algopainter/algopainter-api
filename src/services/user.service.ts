import Result from "../shared/result";
import { UserContext, IUser } from "../domain/user";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { disconnect } from 'mongoose';

/**
 * User service class
 * @class UserService @extends BaseService<IUser>
 */
export default class UserService extends BaseCRUDService<IUser> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<IUser[]>> {
    try {
      await this._connect();
      
      const data = await UserContext
        .find(this.translateToMongoQuery(filter))
        .sort(this.translateToMongoOrder(order));
      
      return Result.success<IUser[]>(null, data);
    } catch(ex) {
      return Result.fail<IUser[]>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<IUser>>> {
    try {
      await this._connect();
      const query = this.translateToMongoQuery(filter);
      const count = await UserContext.find(query).countDocuments();
      
      const data = await UserContext
        .find(query)
        .sort(this.translateToMongoOrder(order))
        .skip((page - 1) * (perPage))
        .limit(perPage);
      
      return Result.success<Paged<IUser>>(null, {
        count,
        currPage: page,
        pages: Math.round(count / perPage),
        perPage,
        data
      });
    } catch(ex) {
      return Result.fail<Paged<IUser>>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async getAsync(id: string): Promise<Result<IUser>> {
    try {
      await this._connect();
      const data = await UserContext.findById(id);
      return Result.success<IUser>(null, data);
    } catch(ex) {
      return Result.fail<IUser>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async createAsync(createdItem: IUser): Promise<Result<IUser>> {
    try {
      await this._connect();
      const input = await UserContext.create(createdItem);
      return Result.success<IUser>(null, input);
    } catch(ex) {
      return Result.fail<IUser>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }
  updateAsync(updatedItem: IUser): Promise<Result<IUser>> {
    throw new Error("Method not implemented.");
  }

}
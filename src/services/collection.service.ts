import Result from "../shared/result";
import { CollectionContext, ICollection } from "../domain/collection";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { disconnect } from 'mongoose';

/**
 * Collection service class
 * @class CollectionService @extends BaseService<ICollection>
 */
export default class CollectionService extends BaseCRUDService<ICollection> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<ICollection[]>> {
    try {
      await this.connect();

      const data = await CollectionContext
        .find(this.translateToMongoQuery(filter))
        .sort(this.translateToMongoOrder(order));

      return Result.success<ICollection[]>(null, data);
    } catch (ex) {
      return Result.fail<ICollection[]>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<ICollection>>> {
    await this.connect();
    const query = this.translateToMongoQuery(filter);
    const count = await CollectionContext.find(query).countDocuments();

    const data = await CollectionContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    await disconnect();
    return Result.success<Paged<ICollection>>(null, {
      count,
      currPage: page,
      pages: Math.round(count / perPage),
      perPage,
      data
    });
  }

  async getAsync(id: string): Promise<Result<ICollection>> {
    await this.connect();
    const data = await CollectionContext.findById(id);
    await disconnect();
    return Result.success<ICollection>(null, data);
  }

  async createAsync(createdItem: ICollection): Promise<Result<ICollection>> {
    await this.connect();
    const input = await CollectionContext.create(createdItem);
    await disconnect();
    return Result.success<ICollection>(null, input);
  }

  updateAsync(id: string, updatedItem: ICollection): Promise<Result<ICollection>> {
    throw new Error("Method not implemented.");
  }

}
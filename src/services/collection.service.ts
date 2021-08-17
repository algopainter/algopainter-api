import Result from "../shared/result";
import { CollectionContext, ICollection } from "../domain/collection";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";

/**
 * Collection service class
 * @class CollectionService @extends BaseService<ICollection>
 */
export default class CollectionService extends BaseCRUDService<ICollection> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<ICollection[]>> {
    const data = await CollectionContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));
    return Result.success<ICollection[]>(null, data);
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<ICollection>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await CollectionContext.find(query).countDocuments();
    const data = await CollectionContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<ICollection>>(null, {
      count,
      currPage: page,
      pages: Math.round(count / perPage),
      perPage,
      data
    });
  }

  async getAsync(id: string): Promise<Result<ICollection>> {
    const data = await CollectionContext.findById(id);
    if(data)
      return Result.success<ICollection>(null, data);
    return Result.fail<ICollection>('Collection not found!', null, 404);
  }

  async createAsync(createdItem: ICollection): Promise<Result<ICollection>> {
    const input = await CollectionContext.create(createdItem);
    return Result.success<ICollection>(null, input);
  }

  updateAsync(id: string, updatedItem: ICollection): Promise<Result<ICollection>> {
    throw new Error("Method not implemented.");
  }

}
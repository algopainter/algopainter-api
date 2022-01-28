import Result from "../shared/result";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { IBid, BidContext } from '../domain/bid';

/**
 * NFT service class
 * @class NFTService @extends BaseService<IBid>
 */
export default class BidService extends BaseCRUDService<IBid> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<IBid[]>> {
    const data = await BidContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));

    return Result.success<IBid[]>(null, data);
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<IBid>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await BidContext.find(query).countDocuments();
    const data = await BidContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<IBid>>(null, {
      count,
      currPage: page,
      pages: Math.ceil(count / perPage),
      perPage,
      data
    });
  }

  async getAsync(id: string): Promise<Result<IBid>> {
    const data = await BidContext.findById(id);
    return Result.success<IBid>(null, data);
  }

  async createAsync(createdItem: IBid): Promise<Result<IBid>> {
    const input = await BidContext.create(createdItem);
    return Result.success<IBid>(null, input);
  }

  updateAsync(id: string, updatedItem: IBid): Promise<Result<IBid>> {
    throw new Error("Method not implemented.");
  }

}
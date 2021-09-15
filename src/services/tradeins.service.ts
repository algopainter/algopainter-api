import Result from "../shared/result";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { ITradeIn, TradeinsContext } from '../domain/tradeins';

/**
 * TradeIns service class
 * @class TradeInsService @extends BaseService<ITradeIn>
 */
export default class TradeInsService extends BaseCRUDService<ITradeIn> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<ITradeIn[]>> {
    const data = await TradeinsContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));

    return Result.success<ITradeIn[]>(null, data);
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<ITradeIn>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await TradeinsContext.find(query).countDocuments();
    const data = await TradeinsContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<ITradeIn>>(null, {
      count,
      currPage: page,
      pages: Math.round(count / perPage),
      perPage,
      data
    });
  }

  async getAsync(id: string): Promise<Result<ITradeIn>> {
    const data = await TradeinsContext.findById(id);
    return Result.success<ITradeIn>(null, data);
  }

  async createAsync(createdItem: ITradeIn): Promise<Result<ITradeIn>> {
    const input = await TradeinsContext.create(createdItem);
    return Result.success<ITradeIn>(null, input);
  }

  updateAsync(id: string, updatedItem: ITradeIn): Promise<Result<ITradeIn>> {
    throw new Error("Method not implemented.");
  }

}
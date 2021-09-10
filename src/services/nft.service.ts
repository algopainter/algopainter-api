import Result from "../shared/result";
import { NFTContext, INFT } from "../domain/nft";
import { HistoricalOwnersContext, IHistoricalOwners } from "../domain/historical.owners";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";

/**
 * NFT service class
 * @class NFTService @extends BaseService<INFT>
 */
export default class NFTService extends BaseCRUDService<INFT> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<INFT[]>> {
    const data = await NFTContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));

    return Result.success<INFT[]>(null, data);
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<INFT>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await NFTContext.find(query).countDocuments();
    const data = await NFTContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<INFT>>(null, {
      count,
      currPage: page,
      pages: Math.round(count / perPage),
      perPage,
      data
    });
  }

  async getByTokenIdAsync(id: number, contract: string): Promise<Result<INFT>> {
    const data = await NFTContext.findOne({ supplyIndex: id, contractAddress: contract.toLowerCase() });
    return Result.success<INFT>(null, data);
  }

  async getOwnersByTokenIdAsync(id: number, contract: string): Promise<Result<IHistoricalOwners[]>> {
    const data = await HistoricalOwnersContext.find({ token: id, contract: contract.toLowerCase() });
    return Result.success<IHistoricalOwners[]>(null, data);
  }

  async getAsync(id: string): Promise<Result<INFT>> {
    const data = await NFTContext.findById(id);
    return Result.success<INFT>(null, data);
  }

  async createAsync(createdItem: INFT): Promise<Result<INFT>> {
    const input = await NFTContext.create(createdItem);
    return Result.success<INFT>(null, input);
  }

  updateAsync(id: string, updatedItem: INFT): Promise<Result<INFT>> {
    throw new Error("Method not implemented.");
  }

}
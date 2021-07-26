import Result from "../shared/result";
import { NFTContext, INFT } from "../domain/nft";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { disconnect } from 'mongoose';

/**
 * NFT service class
 * @class NFTService @extends BaseService<INFT>
 */
export default class NFTService extends BaseCRUDService<INFT> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<INFT[]>> {
    try {
      await this._connect();
      
      const data = await NFTContext
        .find(this.translateToMongoQuery(filter))
        .sort(this.translateToMongoOrder(order));
      
      return Result.success<INFT[]>(null, data);
    } catch(ex) {
      return Result.fail<INFT[]>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<INFT>>> {
    try {
      await this._connect();
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
    } catch(ex) {
      return Result.fail<Paged<INFT>>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async getAsync(id: string): Promise<Result<INFT>> {
    try {
      await this._connect();
      const data = await NFTContext.findById(id);
      return Result.success<INFT>(null, data);
    } catch(ex) {
      return Result.fail<INFT>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async createAsync(createdItem: INFT): Promise<Result<INFT>> {
    try {
      await this._connect();
      const input = await NFTContext.create(createdItem);
      return Result.success<INFT>(null, input);
    } catch(ex) {
      return Result.fail<INFT>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }
  updateAsync(updatedItem: INFT): Promise<Result<INFT>> {
    throw new Error("Method not implemented.");
  }

}
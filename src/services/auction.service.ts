import Result from "../shared/result";
import { AuctionContext, IAuction } from "../domain/auction";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { disconnect } from 'mongoose';
/**
 * Auction service class
 * @class AuctionService @extends BaseCRUDService<IAuction>
 */
export default class AuctionService extends BaseCRUDService<IAuction> {

  /**
   * List auctions data paged
   * @param filter Filter for data
   * @param order Order of data
   * @returns Promise<Result<IAuction[]>>
   */
  async listAsync(filter: IFilter, order: IOrderBy | null): Promise<Result<IAuction[]>> {
    try {
      await this._connect();
      
      const data = await AuctionContext
        .find(this.translateToMongoQuery(filter))
        .sort(this.translateToMongoOrder(order));
      
      return Result.success<IAuction[]>(null, data);
    } catch(ex) {
      return Result.fail<IAuction[]>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  /**
   * Gets information of an Action
   * @param filter Filter for data
   * @returns Promise<Result<IAuction>>
   */
  async getAsync(id: string): Promise<Result<IAuction>> {
    try {
      await this._connect();
      const data = await AuctionContext.findById(id);
      return Result.success<IAuction>(null, data);
    } catch(ex) {
      return Result.fail<IAuction>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  /**
   * List paged auctions data
   * @param filter Filter for data
   * @param order Order of data
   * @param page Current page
   * @param perPage Number of items per page
   * @returns Promise<Result<Paged<IAuction>>>
   */
  async pagedAsync(filter: IFilter, order: IOrderBy | null, page: number, perPage: number): Promise<Result<Paged<IAuction>>> {
    try {
      await this._connect();
      const query = this.translateToMongoQuery(filter);
      const count = await AuctionContext.find(query).countDocuments();
      
      const data = await AuctionContext
        .find(query)
        .sort(this.translateToMongoOrder(order))
        .skip((page - 1) * (perPage))
        .limit(perPage);
      
      return Result.success<Paged<IAuction>>(null, {
        count,
        currPage: page,
        pages: Math.round(count / perPage),
        perPage,
        data
      });
    } catch(ex) {
      return Result.fail<Paged<IAuction>>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  /**
   * Creates an Auction
   * @param createdItem Auction data to be created
   */
  async createAsync(createdItem: IAuction): Promise<Result<IAuction>> {
    try {
      await this._connect();
      const input = await AuctionContext.create(createdItem);
      return Result.success<IAuction>(null, input);
    } catch(ex) {
      return Result.fail<IAuction>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  /**
   * Updated an Auction
   * @param updatedItem Auction data with updated values
   */
  updateAsync(updatedItem: IAuction): Promise<Result<IAuction>> {
    throw new Error("Method not implemented." + updatedItem);
  }
}
import Result from "../shared/result";
import { AuctionContext, IAuction } from "../domain/auction";
import BaseService, { IFilter, IOrderBy } from "./base-service";
import Paged from "../shared/paged";
import { connect, disconnect, Mongoose } from 'mongoose';
import { Settings } from "../shared/settings";
import MongoQS from 'mongo-querystring'
/**
 * Auction service class
 * @class AuctionService @extends BaseService<IAuction>
 */
export default class AuctionService extends BaseService<IAuction> {

  /**
   * Connects to database
   */
  private async _connect() : Promise<Mongoose> {
    return await connect(Settings['mongoURL'], {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
  }

  /**
   * List auctions data paged
   * @param filter Filter for data
   * @param order Order of data
   * @returns Promise<Result<IAuction[]>>
   */
  listAsync(filter: IFilter, order: IOrderBy | null): Promise<Result<IAuction[]>> {
    throw new Error("Method not implemented.");
  }

  /**
   * Gets information of an Action
   * @param filter Filter for data
   * @returns Promise<Result<IAuction>>
   */
  async getAsync(filter: IFilter): Promise<Result<IAuction>> {
    try {
      await this._connect();
      console.log(filter);
      const data = await AuctionContext.findById(filter['id'])
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
  async pagedAsync(filter: IFilter, order: IOrderBy | null, page: number | null, perPage: number | null): Promise<Result<Paged<IAuction>>> {
    try {
      await this._connect();
      const qs = new MongoQS();
      const query = Object.keys(filter).length ? qs.parse(filter) : null;
      console.log(query);
      const count = await AuctionContext.find(query).countDocuments();
      
      const data = await AuctionContext
        .find(query)
        .skip((page - 1) * (perPage))
        .sort(Object.keys(order).length ? order : { createdAt : -1 })
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
import Result from "../shared/result";
import { AuctionContext, IAuction } from "../domain/auction";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { FilterQuery } from "mongoose";
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
    const data = await AuctionContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));
    return Result.success<IAuction[]>(null, data);
  }

  /**
   * List auctions data paged
   * @param filter Filter for data
   * @param order Order of data
   * @returns Promise<Result<IAuction[]>>
   */
   async listPirsAsync(pirsAccount: string, filter: IFilter, order: IOrderBy | null): Promise<Result<IAuction[]>> {
    const query = this.translateToMongoQuery(filter);

    query["pirs." + pirsAccount.toLowerCase()] = { $gte: 0 };

    const data = await AuctionContext
      .find(query)
      .sort(this.translateToMongoOrder(order));
    return Result.success<IAuction[]>(null, data);
  }

  /**
   * List auctions data paged
   * @param filter Filter for data
   * @param order Order of data
   * @returns Promise<Result<IAuction[]>>
   */
   async listBidbacksAsync(pirsAccount: string, filter: IFilter, order: IOrderBy | null): Promise<Result<IAuction[]>> {
    const query = this.translateToMongoQuery(filter);

    query["bidbacks." + pirsAccount.toLowerCase()] = { $gte: 0 };

    const data = await AuctionContext
      .find(query)
      .sort(this.translateToMongoOrder(order));
    return Result.success<IAuction[]>(null, data);
  }

  /**
   * Gets information of an Action
   * @param filter Filter for data
   * @returns Promise<Result<IAuction>>
   */
  async getAsync(id: string): Promise<Result<IAuction>> {
    const data = await AuctionContext.findById(id);
    return Result.success<IAuction>(null, data);
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
      pages: Math.ceil(count / perPage),
      perPage,
      data
    });
  }

  /**
   * List paged auctions data
   * @param filter Filter for data
   * @param order Order of data
   * @param page Current page
   * @param perPage Number of items per page
   * @returns Promise<Result<Paged<IAuction>>>
   */
   async pagedPirsAsync(pirsAccount: string, filter: IFilter, order: IOrderBy | null, page: number, perPage: number): Promise<Result<Paged<IAuction>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await AuctionContext.find(query).countDocuments();

    query["pirs." + pirsAccount.toLowerCase()] = { $gte: 0 };

    const data = await AuctionContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);


    return Result.success<Paged<IAuction>>(null, {
      count,
      currPage: page,
      pages: Math.ceil(count / perPage),
      perPage,
      data
    });
  }

  /**
   * List paged auctions data
   * @param filter Filter for data
   * @param order Order of data
   * @param page Current page
   * @param perPage Number of items per page
   * @returns Promise<Result<Paged<IAuction>>>
   */
   async pagedBidbacksAsync(pirsAccount: string, filter: IFilter, order: IOrderBy | null, page: number, perPage: number): Promise<Result<Paged<IAuction>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await AuctionContext.find(query).countDocuments();

    query["bidbacks." + pirsAccount.toLowerCase()] = { $gte: 0 };

    const data = await AuctionContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);


    return Result.success<Paged<IAuction>>(null, {
      count,
      currPage: page,
      pages: Math.ceil(count / perPage),
      perPage,
      data
    });
  }

  /**
   * Creates an Auction
   * @param createdItem Auction data to be created
   */
  async createAsync(createdItem: IAuction): Promise<Result<IAuction>> {
    const input = await AuctionContext.create(createdItem);
    return Result.success<IAuction>(null, input);
  }

  /**
   * Updated an Auction
   * @param updatedItem Auction data with updated values
   */
  updateAsync(id: string, updatedItem: IAuction): Promise<Result<IAuction>> {
    throw new Error("Method not implemented." + updatedItem);
  }
}
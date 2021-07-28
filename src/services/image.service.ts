import Result from "../shared/result";
import { ImageContext, IImage } from "../domain/image";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { disconnect } from 'mongoose';
import { ILikeRequest, ILikeSignData } from '../requests/like.request';
import Exception from "../shared/exception";
import { AuctionContext } from "../domain/auction";

/**
 * Image service class
 * @class ImageService @extends BaseService<IImage>
 */
export default class ImageService extends BaseCRUDService<IImage> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<IImage[]>> {
    try {
      await this._connect();
      
      const data = await ImageContext
        .find(this.translateToMongoQuery(filter))
        .sort(this.translateToMongoOrder(order));
      
      return Result.success<IImage[]>(null, data);
    } catch(ex) {
      return Result.fail<IImage[]>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<IImage>>> {
    try {
      await this._connect();
      const query = this.translateToMongoQuery(filter);
      const count = await ImageContext.find(query).countDocuments();
      
      const data = await ImageContext
        .find(query)
        .sort(this.translateToMongoOrder(order))
        .skip((page - 1) * (perPage))
        .limit(perPage);
      
      return Result.success<Paged<IImage>>(null, {
        count,
        currPage: page,
        pages: Math.round(count / perPage),
        perPage,
        data
      });
    } catch(ex) {
      return Result.fail<Paged<IImage>>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async getAsync(id: string): Promise<Result<IImage>> {
    try {
      await this._connect();
      const data = await ImageContext.findById(id);
      return Result.success<IImage>(null, data);
    } catch(ex) {
      return Result.fail<IImage>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async createAsync(createdItem: IImage): Promise<Result<IImage>> {
    try {
      await this._connect();
      const input = await ImageContext.create(createdItem);
      return Result.success<IImage>(null, input);
    } catch(ex) {
      return Result.fail<IImage>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  updateAsync(updatedItem: IImage): Promise<Result<IImage>> {
    throw new Error("Method not implemented.");
  }

  async likeAsync(id: string, request: ILikeRequest) : Promise<Result<IImage>> {
    try {
      if(!this.validateSignature<ILikeSignData>(request, { imageId: id, salt: request.salt }))
        throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);
      await this._connect();
      const updated = await ImageContext.findOneAndUpdate({ _id: id }, { $inc : { 'likes' : 1 } });
      console.log(updated)
      await AuctionContext.updateMany({ 'item.id' : id }, { $inc : { 'item.likes' : 1 } });
      return Result.success<IImage>(null, updated);
    } catch(ex) {
      return Result.fail<IImage>(ex.toString(), null);
    } finally {
      await disconnect();
    }
  }

  async dislikeAsync(id: string, request: ILikeRequest) : Promise<Result<IImage>> {
    try {
      if(!this.validateSignature<ILikeSignData>(request, { imageId: id, salt: request.salt }))
        throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);
      await this._connect();
      const updated = await ImageContext.findOneAndUpdate({ _id: id }, {$inc : { 'likes' : -1 }});
      await AuctionContext.updateMany({ 'item.id' : id }, { $inc : { 'item.likes' : -1 } });
      return Result.success<IImage>(null, updated);
    } finally {
      await disconnect();
    }
  }

}
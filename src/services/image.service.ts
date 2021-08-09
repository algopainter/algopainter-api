import Result from "../shared/result";
import { ImageContext, IImage } from "../domain/image";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { ILikeRequest, ILikeSignData } from '../requests/like.request';
import Exception from "../shared/exception";
import { AuctionContext } from "../domain/auction";
import SignService from "./sign.service";

/**
 * Image service class
 * @class ImageService @extends BaseService<IImage>
 */
export default class ImageService extends BaseCRUDService<IImage> {
  async listAsync(filter: IFilter, order: IOrderBy | null): Promise<Result<IImage[]>> {
    const data = await ImageContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));
    return Result.success<IImage[]>(null, data);
  }

  async getByCollection(collectionId: string) : Promise<IImage[]> {
    const data = await ImageContext
      .find({ collectionId: collectionId })
      .sort({ createdAt: -1 });

    return data;
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<IImage>>> {
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
  }

  async getAsync(id: string): Promise<Result<IImage>> {
    const data = await ImageContext.findById(id);
    return Result.success<IImage>(null, data);
  }

  async getByOwnerAsync(account: string): Promise<Result<IImage[]>> {
    const data = await ImageContext.find({ owner: account.toLowerCase() });
    return Result.success<IImage[]>(null, data);
  }

  async getByCreatorAsync(account: string): Promise<Result<IImage[]>> {
    const data = await ImageContext.find({ creator: account.toLowerCase() });
    return Result.success<IImage[]>(null, data);
  }

  async createAsync(createdItem: IImage): Promise<Result<IImage>> {
    const input = await ImageContext.create(createdItem);
    return Result.success<IImage>(null, input);
  }

  updateAsync(id: string, updatedItem: IImage): Promise<Result<IImage>> {
    throw new Error("Method not implemented." + id + JSON.stringify(updatedItem));
  }

  private async _validateLikeSign(request: ILikeRequest, id: string) {
    const signService = new SignService();
    if (!await signService.validate<ILikeSignData>(request, { imageId: id, salt: request.salt }, 'like'))
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);
  }

  async likeAsync(id: string, request: ILikeRequest): Promise<Result<IImage>> {
    // const imageToChange = await ImageContext.findById(id);
    // if (imageToChange && imageToChange.likers && imageToChange.likers.includes(request.account))
    //   return Result.custom<IImage>(false, "This account already liked the image", null, 409);
    // await this._validateLikeSign(request, id);

    await ImageContext.findOneAndUpdate({ _id: id }, {
      $inc: { 'likes': 1 },
      $push: { 'likers': request.account.toLowerCase() }
    });

    await AuctionContext.updateMany({ 'item._id': id }, {
      $inc: { 'item.likes': 1 },
      $push: { 'item.likers': request.account.toLowerCase() }
    });

    return Result.success<IImage>(null, null);
  }

  async dislikeAsync(id: string, request: ILikeRequest | null): Promise<Result<IImage>> {
    // const imageToChange = await ImageContext.findById(id);
    // if (imageToChange && imageToChange.likers && !imageToChange.likers.includes(request.account))
    //   return Result.custom<IImage>(false, "This account didn`t liked the image.", null, 409);
    // await this._validateLikeSign(request, id);

    if(!request)
      return Result.fail<IImage>("The payload to validade the sign is empty.", null);

    await ImageContext.findOneAndUpdate({ _id: id }, {
      $inc: { 'likes': -1 },
      $pull: { 'likers': request.account.toLowerCase() }
    });

    await AuctionContext.updateMany({ 'item._id': id }, {
      $inc: { 'item.likes': -1 },
      $pull: { 'item.likers': request.account.toLowerCase() }
    });

    return Result.success<IImage>(null, null);
  }
}
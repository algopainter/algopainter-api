/* eslint-disable @typescript-eslint/no-explicit-any */
import Result from "../shared/result";
import { ImageContext, IImage } from "../domain/image";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { ILikeRequest, ILikeSignData } from '../requests/like.request';
import Exception from "../shared/exception";
import { AuctionContext } from "../domain/auction";
import SignService from "./sign.service";
import { Types } from "mongoose";
import { HistoricalOwnersContext, IHistoricalOwners } from "../domain/historical.owners";
import Helpers from '../shared/helpers';
import { IUser, UserContext } from "../domain/user";
import { SettingsContext } from "../domain/settings";

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

  async listImagesIWasOwnerAsync(account: string): Promise<Result<IImage[]>> {
    let tokensIwasOwner = await HistoricalOwnersContext.find({ owner: account.toLowerCase() });
    const images = <IImage[]>[];

    if (tokensIwasOwner) {
      tokensIwasOwner = Helpers.distinctBy(['token', 'contract'], tokensIwasOwner);
      for (let index = 0; index < tokensIwasOwner.length; index++) {
        const nftInfo = tokensIwasOwner[index];
        const image = await ImageContext.findOne({
          'nft.index': nftInfo.token,
          collectionOwner: nftInfo.contract
        });

        if (image) {
          images.push(image);
        }
      }
    }

    return Result.success<IImage[]>(null, images, 200);
  }

  async pagedImagesIWasOwnerAsync(account: string, page: number, perPage: number): Promise<Result<Paged<IImage>>> {
    const tokensIwasOwner = await HistoricalOwnersContext.find({ owner: account.toLowerCase() });

    if (tokensIwasOwner) {
      const query = Helpers.distinctBy(['token', 'contract'], tokensIwasOwner).map(a => {
        return {
          "nft.index": a.token,
          "collectionOwner": a.contract
        }
      });
      const count = await ImageContext.find({
        $or: query
      }).countDocuments();

      const data = await ImageContext.find({
        $or: query
      }).sort({ "nft.index": -1 })
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

    return Result.success<Paged<IImage>>(null, {
      count: 0,
      currPage: 0,
      pages: 0,
      perPage,
      data: <IImage[]>[]
    });
  }

  async listLikedBy(account: string, filter: IFilter, order: IOrderBy | null): Promise<Result<IImage[]>> {
    const filterBy = {
      likers: account.toLowerCase(),
      ...this.translateToMongoQuery(filter)
    }

    const data = await ImageContext
      .find(filterBy)
      .sort(this.translateToMongoOrder(order));
    return Result.success<IImage[]>(null, data);
  }

  async getByCollection(collectionId: string): Promise<IImage[]> {
    const data = await ImageContext
      .find({ collectionId: collectionId })
      .sort({ createdAt: -1 });

    return data;
  }

  async pagedLikedByAsync(account: string, filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<IImage>>> {
    const query = {
      likers: account.toLowerCase(),
      ...this.translateToMongoQuery(filter)
    }
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

  async getOwnersOfAsync(id: string, excludeCurrentOwner: boolean): Promise<Result<IUser[]>> {
    const data = await ImageContext.findById(id);

    if (data) {
      const histOwners = await HistoricalOwnersContext.find({
        contract: data.collectionOwner.toLowerCase(),
        token: data.nft.index
      }).sort({ createdAt: -1 });

      const unWantedHashes = (await SettingsContext.findOne())?.smartcontracts?.map(a => a.address) || [];
      const ownerList : string[] = [];

      if(excludeCurrentOwner)
        unWantedHashes.push(data.owner);

      if (unWantedHashes) {
        histOwners.forEach(hist => {
          if (!unWantedHashes.some(a => a == hist.owner))
            ownerList.push(hist.owner.toLowerCase());

          if (!unWantedHashes.some(a => a == hist.from))
            ownerList.push(hist.from.toLowerCase());
        });
      }

      const usersFound = await UserContext.find({ account: { $in: ownerList } });
      const users : IUser[] = [...usersFound];

      ownerList.forEach(owner => {
        if(!usersFound.some(a => a.account == owner))
          users.push({
            account: owner.toLowerCase(),
            updatedAt: new Date(),
            customProfile: owner.toLowerCase(),
            createdAt: new Date(),
            avatar: '',
            email: '',
            bio: '',
            name: owner.toLowerCase(),
            type: 'user'
          })
      });

      return Result.success<IUser[]>(null, users);
    } else {
      return Result.custom<IUser[]>(false, "Image not found.", null, 404, 404);
    }
  }

  async getHistoryOwnersOfAsync(id: string): Promise<Result<IHistoricalOwners[]>> {
    const data = await ImageContext.findById(id);

    if (data) {
      const histOwners = await HistoricalOwnersContext.find({
        contract: data.collectionOwner.toLowerCase(),
        token: data.nft.index
      });

      return Result.success<IHistoricalOwners[]>(null, histOwners);
    } else {
      return Result.custom<IHistoricalOwners[]>(false, "Image not found.", null, 404, 404);
    }
  }

  async getByOwnerCountingAuctions(account: string, filter: IFilter, order: IOrderBy, page: number | undefined, perPage: number | undefined):
    Promise<Result<IImage[] | Paged<IImage>>> {
    const dataImagesImOwner = await ImageContext.find({ owner: account.toLowerCase() }, { _id: 1 });
    const dataImagesImSelling = await AuctionContext.find({ owner: account.toLowerCase() }, { 'item._id': 1 });

    const myImages: any[] = [];

    if (dataImagesImOwner && dataImagesImOwner.length > 0)
      dataImagesImOwner.map(a => myImages.push(a._id));

    if (dataImagesImSelling && dataImagesImSelling.length > 0)
      dataImagesImSelling.map(a => myImages.push(a.item._id));

    const query = this.translateToMongoQuery(filter) || {};

    query["_id"] = { $in: myImages };

    if (page && perPage && page != -1 && perPage != -1) {
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
    } else {
      const data = await ImageContext
        .find(query)
        .sort(this.translateToMongoOrder(order));

      return Result.success<IImage[]>(null, data);
    }
  }

  async getByOwnerAsync(account: string): Promise<Result<IImage[]>> {
    const data = await ImageContext.find({ owner: account.toLowerCase() });
    return Result.success<IImage[]>(null, data);
  }

  async getByCreatorAsync(account: string): Promise<Result<IImage[]>> {
    const data = await ImageContext.find({ creator: account.toLowerCase() });
    return Result.success<IImage[]>(null, data);
  }

  async getByCollectionOwnerAsync(account: string): Promise<Result<IImage[]>> {
    const data = await ImageContext.find({ collectionOwner: account.toLowerCase() });
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
    if (!request)
      return Result.fail<IImage>("The payload to validade the sign is empty.", null);

    const imageToChange = await ImageContext.findById(id);
    if (imageToChange && imageToChange.likers && imageToChange.likers.includes(request.account))
      return Result.custom<IImage>(false, "This account already liked the image", null, 409);

    await this._validateLikeSign(request, id);

    await ImageContext.findOneAndUpdate({ _id: Types.ObjectId(id) }, {
      $inc: { 'likes': 1 },
      $push: { 'likers': request.account.toLowerCase() }
    });

    await AuctionContext.updateMany({ 'item._id': Types.ObjectId(id) }, {
      $inc: { 'item.likes': 1 },
      $push: { 'item.likers': request.account.toLowerCase() }
    });

    return Result.success<IImage>(null, null);
  }

  async dislikeAsync(id: string, request: ILikeRequest | null): Promise<Result<IImage>> {
    if (!request)
      return Result.fail<IImage>("The payload to validade the sign is empty.", null);

    const imageToChange = await ImageContext.findById(id);
    if (imageToChange && imageToChange.likers && !imageToChange.likers.includes(request.account))
      return Result.custom<IImage>(false, "This account didn`t liked the image.", null, 409);

    await this._validateLikeSign(request, id);

    if (imageToChange?.likes == 0)
      return Result.custom<IImage>(false, "You can`t have negative likes.", null, 409);

    await ImageContext.findOneAndUpdate({ _id: Types.ObjectId(id) }, {
      $inc: { 'likes': -1 },
      $pull: { 'likers': request.account.toLowerCase() }
    });

    await AuctionContext.updateMany({ 'item._id': Types.ObjectId(id) }, {
      $inc: { 'item.likes': -1 },
      $pull: { 'item.likers': request.account.toLowerCase() }
    });

    return Result.success<IImage>(null, null);
  }
}
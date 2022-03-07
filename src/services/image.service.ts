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
import AuctionService from "./auction.service";
import { IMintData, IMintDataRequest, MintTokenURI, MintTokenURIResponse } from '../requests/mint.data.request';
import Settings from "../shared/settings";
import Jimp from 'jimp';
import Pinata, { PinataClient, PinataOptions, PinataPinOptions } from '@pinata/sdk';
import { Readable } from "stream";
import Web3 from "web3";

/**
 * Image service class
 * @class ImageService @extends BaseService<IImage>
 */
export default class ImageService extends BaseCRUDService<IImage> {

  private auctionService: AuctionService;

  constructor() {
    super();
    this.auctionService = new AuctionService();
  }

  async listAsync(filter: IFilter, order: IOrderBy | null): Promise<Result<IImage[]>> {
    const data = await ImageContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));
    return Result.success<IImage[]>(null, data);
  }

  async listImagesIWasOwnerAsync(account: string, filter: IFilter | null | undefined, order: IOrderBy | null): Promise<Result<IImage[]>> {
    const tokensInfo = await this.auctionService.getCompletedAuctionsByAccount(account);

    if (tokensInfo) {
      const query = Helpers.distinctBy(['token', 'contract'], tokensInfo)
        .map(a => {
          return {
            "nft.index": a.token,
            "collectionOwner": a.contract,
            ...filter
          }
        });

      const images = await ImageContext.find({
        $or: query
      }).sort(this.translateToMongoOrder(order, { "nft.index": -1 }));

      return Result.success<IImage[]>(null, images, 200);
    }
    return Result.success<IImage[]>(null, null, 404);
  }

  async pagedImagesIWasOwnerAsync(account: string, page: number, perPage: number, filter: IFilter | null | undefined, order: IOrderBy | null): Promise<Result<Paged<IImage>>> {
    const tokensInfo = await this.auctionService.getCompletedAuctionsByAccount(account);

    if (tokensInfo) {
      const query = Helpers.distinctBy(['token', 'contract'], tokensInfo)
        .map(a => {
          return {
            "nft.index": a.token,
            "collectionOwner": a.contract,
            ...filter
          }
        });

      const count = await ImageContext.find({
        $or: query
      }).countDocuments();

      const data = await ImageContext.find({
        $or: query
      }).sort(this.translateToMongoOrder(order, { "nft.index": -1 }))
        .skip((page - 1) * (perPage))
        .limit(perPage);

      return Result.success<Paged<IImage>>(null, {
        count,
        currPage: page,
        pages: Math.ceil(count / perPage),
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
      pages: Math.ceil(count / perPage),
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
      pages: Math.ceil(count / perPage),
      perPage,
      data
    });
  }

  async getAsync(id: string): Promise<Result<IImage>> {
    const data = await ImageContext.findById(id);
    return Result.success<IImage>(null, data);
  }

  async getOwnersOfAsync(id: string, includeCurrentOwner: boolean): Promise<Result<IUser[]>> {
    const data = await ImageContext.findById(id);

    if (data) {
      const auctionSystemAddress = await this.auctionService.getAuctionSmartContract();

      const completedAuctions = await AuctionContext.find({
        address: auctionSystemAddress,
        ended: true,
        highestBid: { $exists: true },
        "item.index": data.nft.index,
        "item.collectionOwner": data.collectionOwner,
      });

      const ownerList: string[] = completedAuctions.map(a => a.owner);

      if (includeCurrentOwner)
        ownerList.push(data.owner);

      const usersFound = await UserContext.find({ account: { $in: ownerList } });
      const users: IUser[] = [...usersFound];

      ownerList.forEach(owner => {
        if (!usersFound.some(a => a.account == owner))
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

  async getDetailedOwnersOfAsync(id: string): Promise<Result<IUser[]>> {
    const data = await ImageContext.findById(id);

    if (data) {
      const histOwners = await HistoricalOwnersContext.find({
        contract: data.collectionOwner.toLowerCase(),
        token: data.nft.index
      }).sort({ createdAt: 1 });

      const unWantedHashes = (await SettingsContext.findOne())?.smartcontracts?.map(a => a.address) || [];
      const ownerList: string[] = [];

      if (unWantedHashes) {
        histOwners.forEach(hist => {
          if (!unWantedHashes.some(a => a == hist.owner))
            ownerList.push(hist.owner.toLowerCase());

          if (!unWantedHashes.some(a => a == hist.from))
            ownerList.push(hist.from.toLowerCase());
        });
      }

      const usersFound = await UserContext.find({ account: { $in: ownerList } });
      const users: IUser[] = [...usersFound];

      ownerList.forEach(owner => {
        if (!usersFound.some(a => a.account == owner))
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

      return Result.success<any>(null, users);
    } else {
      return Result.custom<any>(false, "Image not found.", null, 404, 404);
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

  async getByOwnerCountingAuctions(account: string, filter: IFilter, order: IOrderBy, page: number | undefined, perPage: number | undefined, includeExpiredAuctions: boolean):
    Promise<Result<IImage[] | Paged<IImage>>> {
    const dataImagesImOwner = await ImageContext.find({ owner: account.toLowerCase() }, { _id: 1 });
    let dataImagesImSelling = await AuctionContext.find({ owner: account.toLowerCase(), ended: false }, { expirationDt: 1, 'item._id': 1 });

    if (!includeExpiredAuctions) {
      const now = new Date().getTime();
      dataImagesImSelling = dataImagesImSelling.filter(a => now < a.expirationDt.getTime())
    }

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
        pages: Math.ceil(count / perPage),
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

  async pinToIPFS(body: Record<string, any>, type: string, doResize: boolean = false) : Promise<Result<Record<string, string>>> {
    if (!body)
      return Result.fail<Record<string, string>>("The payload is empty.", null);
    
    if(type == 'FILE') {
      let rawImage64 = body.image;
      const rawImageBytes = rawImage64.split(',')[1];
      const rawImageHash = Web3.utils.keccak256(rawImageBytes);

      if(doResize) {
        rawImage64 = await this.resizeImage(rawImage64, 400, 400);
      }

      const rawImageIPFS = await this.pinFileToIPFS(rawImage64, body.fileName, { 
        name: body.name, 
        description: body.description, 
        mintedBy: body.mintedBy,
        rawImageHash
      });

      return Result.success<Record<string, string>>('', {
        ipfsHash: rawImageIPFS
      }, null, null);
    }

    if(type == 'JSON') {
      const ipfsHash = await this.pinJsonToIPFS(body);

      return Result.success<Record<string, string>>('', {
        ipfsHash: ipfsHash
      }, null, null);
    }

    return Result.fail<Record<string, string>>("The payload type is unknown.", null);
  }

  async obtainMintImageData(request: IMintDataRequest): Promise<Result<MintTokenURIResponse>> {
    if (!request)
      return Result.fail<MintTokenURIResponse>("The payload to validade the sign is empty.", null);

    // const signService = new SignService();
    // if (!await signService.validate<IMintData>(request, request.data, 'mint'))
    //   throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    const rawImage64 = request.data.image;
    const rawImageBytes = rawImage64.split(',')[1];
    const rawImageHash = Web3.utils.keccak256(rawImageBytes);

    const rawImage = await this.pinFileToIPFS(rawImage64, request.data.fileName, { 
      name: request.data.name, 
      description: request.data.description, 
      mintedBy: request.data.mintedBy,
      rawImageHash
    });

    const resizedImage = await this.resizeImage(rawImage64, 2000, 2000);

    const image = await this.pinFileToIPFS(resizedImage, request.data.fileName, { 
      name: request.data.name, 
      description: request.data.description, 
      mintedBy: request.data.mintedBy,
      rawImageHash
    });

    const resizedPreviewImage = await this.resizeImage(rawImage64, 300, 300);

    const previewImage = await this.pinFileToIPFS(resizedPreviewImage, request.data.fileName, { 
      name: request.data.name, 
      description: request.data.description, 
      mintedBy: request.data.mintedBy,
      rawImageHash
    });

    const tokenUriToPin : MintTokenURI = {
      name: request.data.name,
      description: request.data.description,
      fileName: request.data.fileName,
      creatorRoyalty: request.data.creatorRoyalty,
      mintedBy: request.data.mintedBy,
      rawImage: 'https://ipfs.io/ipfs/' + rawImage,
      image: 'https://ipfs.io/ipfs/' + image,
      previewImage: 'https://ipfs.io/ipfs/' + previewImage,
      rawImageHash
    };

    const tokenUriHash = await this.pinJsonToIPFS(tokenUriToPin);

    return Result.success<MintTokenURIResponse>(null, {
      tokenURI: tokenUriHash,
      data: tokenUriToPin
    });
  }

  async resizeImage(bytes: string, width: number, height: number) : Promise<string> {
    const buffer = Buffer.from(bytes.split(',')[1], 'base64');
    const image = await Jimp.read(buffer);
    let didResize = false;

    if(image.getWidth() > width) {
      image.resize(width, Jimp.AUTO);
      didResize = true;
    }

    if(image.getHeight() > height) {
      image.resize(Jimp.AUTO, height);
      didResize = true;
    }

    if(didResize) {
      const mime = bytes.split(',')[0].split(':')[1].split(';')[0];
      return await image.getBase64Async(mime);
    } else {
      return bytes;
    }
  }

  private getPinClient() : PinataClient {
    const pinKey = Settings.pinataInfo();
    return Pinata(pinKey.key, pinKey.secret);
  }

  async pinFileToIPFS(bytes: string, filename: string, metadata: Record<string, string> = {}) : Promise<string> {
    const pinClient = this.getPinClient();
    const readable = new Readable({
      read() {
        this.push(Buffer.from(bytes.split(',')[1], 'base64'));
        this.push(null);
      },
    });

    (readable as any).path = filename;

    const options : PinataPinOptions = {
      pinataMetadata: {
        filename,
        ...metadata
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const result = await pinClient.pinFileToIPFS(readable, options);

    return result.IpfsHash;
  }

  async pinJsonToIPFS(json: any) : Promise<string> {
    const pinClient = this.getPinClient();
    const options : PinataPinOptions = {
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const result = await pinClient.pinJSONToIPFS(json, options);

    return result.IpfsHash;
  }
}
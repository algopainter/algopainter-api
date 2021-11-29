import Result from "../shared/result";
import { UserContext, IUser, UserDocument } from "../domain/user";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { IUserUpdateRequest, IUserUpdateSignData } from '../requests/user.update.request';
import SignService from "./sign.service";
import Exception from "../shared/exception";
import { AuctionContext, IAuction } from "../domain/auction";
import { IImage, ImageContext } from "../domain/image";
import Helpers from "../shared/helpers";
import AuctionService from "./auction.service";

/**
 * User service class
 * @class UserService @extends BaseService<IUser>
 */
export default class UserService extends BaseCRUDService<IUser> {
  private auctionService: AuctionService;

  constructor() {
    super();
    this.auctionService = new AuctionService();
  }

  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<IUser[]>> {

    const data = await UserContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));

    return Result.success<IUser[]>(null, data);
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<IUser>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await UserContext.find(query).countDocuments();

    const data = await UserContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<IUser>>(null, {
      count,
      currPage: page,
      pages: Math.ceil(count / perPage),
      perPage,
      data: data as IUser[]
    });
  }

  async getAccountByCustomUrl(customProfileQuery: string): Promise<Result<unknown>> {
    const user = await UserContext.findOne({ customProfile: customProfileQuery });

    if (user)
      return Result.success<unknown>(null, { account: user.account }, 200);
    return Result.fail<unknown>("The user with specified custom profile does not exists.", null, 404, 391);
  }

  async getAsync(id: string): Promise<Result<IUser>> {
    const data = await UserContext.findOne({ account: id.toLowerCase() });
    if (!data)
      return Result.success<never>(null, null, 404);
    return Result.success<IUser>(null, (data as IUser));
  }

  async getAuctionsThatUserBidAsync(
    account: string,
    page: number | undefined,
    perPage: number | undefined,
    filter: IFilter | null,
    order: IOrderBy | null,
    hasPirs: boolean | null,
    hasBidbacks: boolean | null,
    forBidbacks: boolean | null,
    forBids: boolean | null
  ):
    Promise<Result<Paged<IAuction>> | Result<IAuction[]>> {
    const bidsQuery: any = {};
    const pirsQuery: any = {};
    const bidbacksQuery: any = {};
    const forBidbacksQuery: any = {};

    if (hasPirs === true) {
      pirsQuery["pirs." + account.toLowerCase()] = { $gte: 0 };
    } else if (hasPirs === false) {
      pirsQuery["pirs." + account.toLowerCase()] = { $exists: false };
    }

    if (hasBidbacks === true) {
      bidbacksQuery["bidbacks." + account.toLowerCase()] = { $gte: 0 };
    } else if (hasBidbacks === false) {
      bidbacksQuery["bidbacks." + account.toLowerCase()] = { $exists: false };
    }

    if (forBidbacks === true) {
      let bidbackToExclude = await AuctionContext.find({
        "bids.bidder": account.toLowerCase(),
        $or: [
          {
            ended: true
          }, {
            expirationDt: { $lte: new Date() }
          }
        ]
      });

      bidbackToExclude = bidbackToExclude.filter(a => {
        try {
          return !a.bidbacks[account.toLowerCase()]
        } catch (e) {
          return true;
        }
      });

      forBidbacksQuery["index"] = {
        $nin: bidbackToExclude.map(a => a.index)
      };
    }

    if (forBids) {
      const dubQuery: any = {};
      const willExclude: number[] = [];
      dubQuery["returns." + account] = { $exists: false };
      let auctionToExclude = await AuctionContext.find({
        "bids.bidder": account.toLowerCase(),
        ended: true,
        $or: [
          {
            "highestBid.account" : { $ne: account },
          },
          {
            ...dubQuery
          }
        ]
      });

      if(auctionToExclude && auctionToExclude.length) {
        auctionToExclude.map(a => willExclude.push(a.index));
      }

      auctionToExclude = await AuctionContext.find({
        "bids.bidder": account.toLowerCase(),
        ...dubQuery,
      });

      if(auctionToExclude && auctionToExclude.length) {
        auctionToExclude.map(a => willExclude.push(a.index));
      }
      
      if(auctionToExclude && auctionToExclude.length > 0) {  
        bidsQuery["index"] = {
          $nin: willExclude
        };
      }
    }

    const queryFilter = {
      "bids.bidder": account.toLowerCase(),
      ...(filter ? this.translateToMongoQuery(filter) : {}),
      ...pirsQuery,
      ...bidbacksQuery,
      ...forBidbacksQuery,
      ...bidsQuery
    }

    if (page && perPage && page != -1 && perPage != -1) {
      const count = await AuctionContext.find(queryFilter).countDocuments();

      const data = await AuctionContext
        .find(queryFilter)
        .skip((page - 1) * (perPage))
        .sort(this.translateToMongoOrder(order))
        .limit(perPage);

      return Result.success<Paged<IAuction>>(null, {
        count,
        currPage: page,
        pages: Math.ceil(count / perPage),
        perPage,
        data: data as IAuction[]
      });
    } else {
      const data = await AuctionContext
        .find(queryFilter).sort(this.translateToMongoOrder(order));

      return Result.success<IAuction[]>(null, data);
    }
  }

  async getAuctionsThatUserPIRSAsync(
    account: string,
    page: number | undefined,
    perPage: number | undefined,
    filter: IFilter | null,
    order: IOrderBy | null,
  ): Promise<Result<Paged<IAuction>> | Result<IAuction[]>> {
    const forPirsQuery: any = {};
    const tokensInfo = await this.auctionService.getCompletedAuctionsByAccount(account);
    let images: IImage[] = [];

    if (tokensInfo && tokensInfo.length) {
      const query = Helpers.distinctBy(['token', 'contract'], tokensInfo)
        .map(a => {
          return {
            "nft.index": a.token,
            "collectionOwner": a.contract,
            ...filter
          }
        });

      images = await ImageContext.find({
        $or: query
      }).sort(this.translateToMongoOrder(order, { "nft.index": -1 }));
    }

    let pirsToExclude = await AuctionContext.find({
      $or: [
        {
          ended: true
        }, {
          expirationDt: { $lte: new Date() }
        }
      ]
    });

    pirsToExclude = pirsToExclude.filter(a => {
      try {
        return !a.pirs[account.toLowerCase()]
      } catch (e) {
        return true;
      }
    });

    forPirsQuery["index"] = {
      $nin: pirsToExclude.map(a => a.index)
    };

    let queryFilter: any = null;

    if (images && images.length) {
      queryFilter = {
        ...(filter ? this.translateToMongoQuery(filter) : {}),
        ...forPirsQuery,
        $or: images.map(a => {
          return {
            "item.index": a.nft.index,
            "item.collectionOwner": a.collectionOwner
          }
        })
      }
    }

    if (queryFilter) {
      if (page && perPage && page != -1 && perPage != -1) {
        const count = await AuctionContext.find(queryFilter).countDocuments();

        const data = await AuctionContext
          .find(queryFilter)
          .skip((page - 1) * (perPage))
          .sort(this.translateToMongoOrder(order))
          .limit(perPage);

        return Result.success<Paged<IAuction>>(null, {
          count,
          currPage: page,
          pages: Math.ceil(count / perPage),
          perPage,
          data: data as IAuction[]
        });
      } else {
        const data = await AuctionContext
          .find(queryFilter).sort(this.translateToMongoOrder(order));

        return Result.success<IAuction[]>(null, data);
      }
    } else {
      return Result.success<IAuction[]>(null, []);
    }
  }

  async createAsync(createdItem: IUser): Promise<Result<IUser>> {
    const input = await UserContext.create(createdItem);
    return Result.success<IUser>(null, (input as IUser));
  }

  async updateAsync(id: string, updatedItem: IUser): Promise<Result<IUser>> {
    const input = await UserContext.findByIdAndUpdate(id, updatedItem);
    return Result.success<IUser>(null, (input as IUser));
  }

  async updateUser(account: string, request: IUserUpdateRequest): Promise<Result<IUser>> {
    let responseResult: Result<IUser> = Result.fail<IUser>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    if (!await signService.validate<IUserUpdateSignData>(request, request.data, 'user_update'))
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    if (request.data.customProfile !== null &&
      request.data.customProfile !== undefined &&
      (request.data.customProfile.startsWith('0x')) || /^\s+$/.test(request.data.customProfile as string)) {
      return Result.fail<IUser>("The custom profile url is invalid.", null, 400, 392);
    }

    if (!(await this._checkUniqueness(account, request.data))) {
      const result = await this.getAsync(account);

      if (result.success && result.data && result.data.account) {
        await this.updateAsync((result.data as UserDocument)._id, {
          account: account.toLowerCase(),
          updatedAt: new Date(),
          customProfile: this._sanitizeCustomUrl(request.data.customProfile?.trim()),
          createdAt: result.data.createdAt,
          avatar: request.data.avatar,
          email: request.data.email,
          bio: request.data.bio,
          name: request.data.name,
          type: result.data.type,
          webSite: request.data.webSite,
          facebook: request.data.facebook,
          instagram: request.data.instagram,
          twitter: request.data.twitter,
          telegram: request.data.telegram,
          gmail: request.data.gmail,
        });
        responseResult = await this.getAsync(account);
      } else {
        const createResult = await this.createAsync({
          account: account.toLowerCase(),
          updatedAt: new Date(),
          customProfile: this._sanitizeCustomUrl(request.data.customProfile?.trim()),
          createdAt: new Date(),
          avatar: request.data.avatar,
          bio: request.data.bio,
          email: request.data.email,
          name: request.data.name,
          type: 'user',
          webSite: request.data.webSite,
          facebook: request.data.facebook,
          instagram: request.data.instagram,
          twitter: request.data.twitter,
          telegram: request.data.telegram,
          gmail: request.data.gmail,
        });
        responseResult = createResult;
      }
    } else {
      responseResult = Result.custom<IUser>(false, "The data sent is not unique!", null, 409, 390);
    }

    try {
      await this._propagateUserChanges(account, request.data);
    } catch (e) {
      console.log('Failed to propagate user changes.', e);
    }

    return responseResult;
  }

  private _sanitizeCustomUrl(url: string | null | undefined): string {
    if (url) {
      const notAllowed = /[^a-zA-Z0-9-]/g;
      return !notAllowed.test(url) ? url : '';
    }
    return '';
  }

  private async _checkUniqueness(account: string, userInfo: IUserUpdateSignData) {
    const foundUsers = await UserContext.find({
      account: {
        $ne: account.toLowerCase()
      }
    });

    if (userInfo.email || userInfo.customProfile) {
      const checkEmail = userInfo.email ? foundUsers.some(a =>
        (a.email && a.email?.toLowerCase().trim() == userInfo.email?.toLowerCase().trim())
      ) : false;

      const checkCustomProfile = userInfo.customProfile ? foundUsers.some(a =>
        (a.customProfile && a.customProfile?.toLowerCase().trim() == userInfo.customProfile?.toLowerCase().trim())
      ) : false;

      return checkEmail || checkCustomProfile;
    }

    return false;
  }

  private async _propagateUserChanges(account: string, userInfo: IUserUpdateSignData) {
    await ImageContext.updateMany({
      users: {
        $elemMatch: {
          account: account.toLowerCase()
        }
      }
    }, {
      'users.$[].name': userInfo.name,
      'users.$[].avatar': userInfo.avatar,
      'users.$[].customProfile': userInfo.customProfile,
      'users.$[].webSite': userInfo.webSite,
      'users.$[].email': userInfo.email,
      'users.$[].facebook': userInfo.facebook,
      'users.$[].instagram': userInfo.instagram,
      'users.$[].twitter': userInfo.twitter,
      'users.$[].telegram': userInfo.telegram,
      'users.$[].gmail': userInfo.gmail
    }, {
      multi: true
    });

    await AuctionContext.updateMany({
      bids: {
        $elemMatch: {
          account: account.toLowerCase()
        }
      }
    }, {
      'bids.$[].name': userInfo.name,
      'bids.$[].avatar': userInfo.avatar,
      'bids.$[].customProfile': userInfo.customProfile,
      'bids.$[].webSite': userInfo.webSite,
      'bids.$[].email': userInfo.email,
      'bids.$[].facebook': userInfo.facebook,
      'bids.$[].instagram': userInfo.instagram,
      'bids.$[].twitter': userInfo.twitter,
      'bids.$[].telegram': userInfo.telegram,
      'bids.$[].gmail': userInfo.gmail
    }, {
      multi: true
    });

    await AuctionContext.updateMany({
      'highestBid.account': account.toLowerCase()
    }, {
      'name': userInfo.name,
      'avatar': userInfo.avatar,
      'customProfile': userInfo.customProfile,
      'webSite': userInfo.webSite,
      'email': userInfo.email,
      'facebook': userInfo.facebook,
      'instagram': userInfo.instagram,
      'twitter': userInfo.twitter,
      'telegram': userInfo.telegram,
      'gmail': userInfo.gmail
    });

    await AuctionContext.updateMany({
      'lowestBid.account': account.toLowerCase()
    }, {
      'name': userInfo.name,
      'avatar': userInfo.avatar,
      'customProfile': userInfo.customProfile,
      'webSite': userInfo.webSite,
      'email': userInfo.email,
      'facebook': userInfo.facebook,
      'instagram': userInfo.instagram,
      'twitter': userInfo.twitter,
      'telegram': userInfo.telegram,
      'gmail': userInfo.gmail
    });
  }
}
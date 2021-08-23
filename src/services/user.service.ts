import Result from "../shared/result";
import { UserContext, IUser, UserDocument } from "../domain/user";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import Paged from "../shared/paged";
import { IUserUpdateRequest, IUserUpdateSignData } from '../requests/user.update.request';
import SignService from "./sign.service";
import Exception from "../shared/exception";
import { AuctionContext } from "../domain/auction";
import { ImageContext } from "../domain/image";

/**
 * User service class
 * @class UserService @extends BaseService<IUser>
 */
export default class UserService extends BaseCRUDService<IUser> {
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
      pages: Math.round(count / perPage),
      perPage,
      data: data as IUser[]
    });
  }

  async getAccountByCustomUrl(customProfileQuery: string): Promise<Result<unknown>> {
    const user = await UserContext.findOne({ customProfile: customProfileQuery });

    if(user)
      return Result.success<unknown>(null, { account: user.account }, 200);
    return Result.fail<unknown>("The user with specified custom profile does not exists.", null, 404, 391);
  }

  async getAsync(id: string): Promise<Result<IUser>> {
    const data = await UserContext.findOne({ account: id.toLowerCase() });
    if (!data)
      return Result.success<never>(null, null, 404);
    return Result.success<IUser>(null, (data as IUser));
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
    const signService = new SignService();
    if (!await signService.validate<IUserUpdateSignData>(request, request.data, 'user_update'))
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);
    let responseResult: Result<IUser> = Result.fail<IUser>("The request is invalid.", null, 400);

    if (!(await this._checkUniqueness(account, request.data))) {
      const result = await this.getAsync(account);

      if (result.success && result.data && result.data.account) {
        await this.updateAsync((result.data as UserDocument)._id, {
          account: account.toLowerCase(),
          updatedAt: new Date(),
          customProfile: this._sanitizeCustomUrl(request.data.customProfile),
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
          customProfile: this._sanitizeCustomUrl(request.data.customProfile),
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

  private _sanitizeCustomUrl(url: string | null | undefined) : string {
    if(url) {
      const notAllowed = /[^a-zA-Z0-9-]/g;
      return !notAllowed.test(url) ? url : '' ;
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
      'users.$[].customProfile': userInfo.customProfile
    }, {
      multi: true
    });

    await AuctionContext.updateMany({
      users: {
        $elemMatch: {
          account: account.toLowerCase()
        }
      }
    }, {
      'users.$[].name': userInfo.name,
      'users.$[].avatar': userInfo.avatar,
      'users.$[].customProfile': userInfo.customProfile
    }, {
      multi: true
    });
  }
}
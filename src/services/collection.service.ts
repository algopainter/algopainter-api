import Result from "../shared/result";
import { CollectionContext, CollectionDocument, ICollection, CollectionValidator } from "../domain/collection";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import { ICollectionApproveRequest, ICollectionApproveRequestSignData, ICollectionPatchRequest, ICollectionPatchRequestSignData, ICollectionUpdateCreateRequest, ICollectionUpdateCreateSignData } from '../requests/collection.create.update.request';
import Paged from "../shared/paged";
import SignService from "./sign.service";
import Exception from "../shared/exception";

/**
 * Collection service class
 * @class CollectionService @extends BaseService<ICollection>
 */
export default class CollectionService extends BaseCRUDService<ICollection> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<ICollection[]>> {
    const data = await CollectionContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));
    return Result.success<ICollection[]>(null, data);
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<ICollection>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await CollectionContext.find(query).countDocuments();
    const data = await CollectionContext
      .find(query)
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<ICollection>>(null, {
      count,
      currPage: page,
      pages: Math.ceil(count / perPage),
      perPage,
      data
    });
  }

  async getAsync(id: string): Promise<Result<ICollection>> {
    const data = await CollectionContext.findById(id);
    if(data)
      return Result.success<ICollection>(null, data);
    return Result.fail<ICollection>('Collection not found!', null, 404);
  }

  async getByTitleAsync(title: string): Promise<Result<ICollection>> {
    const data = await CollectionContext.findOne({ title: new RegExp(["^", title.toLowerCase(), "$"].join(""), "i") });
    if(data)
      return Result.success<ICollection>(null, data);
    return Result.fail<ICollection>('Collection not found!', null, 404);
  }

  private validateCollectionData(data: ICollection) : any {
    var invalid = CollectionValidator(data);
    if(invalid)
      throw new Error(invalid);
  }

  async patchCollection(request: ICollectionPatchRequest, id: number) {
    let responseResult: Result<ICollection> = Result.fail<ICollection>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    if (!await signService.validate<ICollectionPatchRequestSignData>(request, request.data, 'collection_patch'))
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    const result = await CollectionContext.findOne({
      blockchainId: id
    });

    if(result) {
      return await this.updateAsync((result as CollectionDocument)._id, {
        avatar: request.data.avatar,
        description: request.data.description,
        api: request.data.api
      });
    }

    return responseResult;    
  }

  async approveCollection(request: ICollectionApproveRequest, id: number) {
    let responseResult: Result<ICollection> = Result.fail<ICollection>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    if (!await signService.validate<ICollectionApproveRequestSignData>(request, request.data, 'approve_collection'))
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    const result = await CollectionContext.findOne({
      blockchainId: id
    });

    if(result) {
      return await this.updateAsync((result as CollectionDocument)._id, {
        show: true,
        approvedBy: request.data.approvedBy
      });
    }

    return responseResult;    
  }

  async createOrUpdateCollectionWithSign(request: ICollectionUpdateCreateRequest, id: string | undefined = undefined): Promise<Result<ICollection>> {
    let responseResult: Result<ICollection> = Result.fail<ICollection>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    if (!await signService.validate<ICollectionUpdateCreateSignData>(request, request.data, 'collection_creation'))
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    if (!(await this._checkUniqueness(request.data)) && this.validateCollectionData(request.data)) {
      let result : Result<ICollection> | null = await this.getByTitleAsync(request.data.title);

      if(id) {
        result = await this.getAsync(id);
        if (!(result.success && result.data && result.data.account)) {
          return Result.custom<ICollection>(false, "The collection has not been found!", null, 404);
        }
      }
      
      if (result.success && result.data && result.data.account) {
        await this.updateAsync((result.data as CollectionDocument)._id, {
          title: request.data.title,
          avatar: request.data.avatar,
          account: result.data.account,
          description: request.data.description,
          owner: request.data.owner,
          metrics: request.data.metrics,
          api: request.data.api
        });
        responseResult = await this.getByTitleAsync(request.data.title);
      }
    } else {
      responseResult = Result.custom<ICollection>(false, "The data sent is not unique!", null, 409, 390);
    }

    return responseResult;
  }

  private async _checkUniqueness(collectionInfo: ICollectionUpdateCreateSignData) {
    const foundCollections = await CollectionContext.find({
      title: {
        $ne: collectionInfo.title.toLowerCase()
      }
    });

    if (collectionInfo.title || collectionInfo.owner) {
      const checkTitle = collectionInfo.title ? foundCollections.some(a =>
        (a.title && a.title?.toLowerCase().trim() == collectionInfo.title?.toLowerCase().trim())
      ) : false;

      const checkOwner = collectionInfo.owner ? foundCollections.some(a =>
        (a.owner && a.owner?.toLowerCase().trim() == collectionInfo.owner?.toLowerCase().trim())
      ) : false;

      return checkTitle || checkOwner;
    }

    return false;
  }

  async createAsync(createdItem: ICollection): Promise<Result<ICollection>> {
    const input = await CollectionContext.create(createdItem);
    return Result.success<ICollection>(null, input);
  }

  async updateAsync(id: string, updatedItem: Partial<ICollection>): Promise<Result<ICollection>> {
    const input = await CollectionContext.findByIdAndUpdate(id, updatedItem);
    return Result.success<ICollection>(null, (input as ICollection));
  }

}
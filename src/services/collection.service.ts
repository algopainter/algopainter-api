import Result from "../shared/result";
import { CollectionContext, CollectionDocument, ICollection, CollectionValidator } from "../domain/collection";
import { IFilter, IOrderBy, BaseCRUDService } from "./base.service";
import { ICollectionApproveRequest, ICollectionApproveRequestSignData, ICollectionPatchRequest, ICollectionPatchRequestSignData, ICollectionExternalNFTRequest, ICollectionExternalNFTRequestSignData } from '../requests/collection.create.update.request';
import Paged from "../shared/paged";
import SignService from "./sign.service";
import Exception from "../shared/exception";
import { UserContext } from "../domain/user";
import { NFTContext } from "../domain/nft";
import { ImageContext } from "../domain/image";

/**
 * Collection service class
 * @class CollectionService @extends BaseService<ICollection>
 */
export default class CollectionService extends BaseCRUDService<ICollection> {
  async listAsync(filter: IFilter, order: IOrderBy): Promise<Result<ICollection[]>> {
    const data = await CollectionContext
      .find({
        ...this.translateToMongoQuery(filter),
        "metrics.endDT": { $gt: new Date() }
      })
      .sort(this.translateToMongoOrder(order));
    return Result.success<ICollection[]>(null, data as ICollection[]);
  }

  async listAsync2(filter: IFilter, order: IOrderBy): Promise<Result<ICollection[]>> {
    const data = await CollectionContext
      .find(this.translateToMongoQuery(filter))
      .sort(this.translateToMongoOrder(order));
    return Result.success<ICollection[]>(null, data as ICollection[]);
  }

  async pagedAsync2(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<ICollection>>> {
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
      data: data as ICollection[]
    });
  }

  async pagedAsync(filter: IFilter, order: IOrderBy, page: number, perPage: number): Promise<Result<Paged<ICollection>>> {
    const query = this.translateToMongoQuery(filter);
    const count = await CollectionContext.find({
      ...query,
      "metrics.endDT": { $gt: new Date() }
    }).countDocuments();
    const data = await CollectionContext
      .find({
        ...query,
        "metrics.endDT": { $gt: new Date() }
      })
      .sort(this.translateToMongoOrder(order))
      .skip((page - 1) * (perPage))
      .limit(perPage);

    return Result.success<Paged<ICollection>>(null, {
      count,
      currPage: page,
      pages: Math.ceil(count / perPage),
      perPage,
      data: data as ICollection[]
    });
  }

  async getAsync(id: string): Promise<Result<ICollection>> {
    const data = await CollectionContext.findById(id);
    if(data)
      return Result.success<ICollection>(null, data as ICollection);
    return Result.fail<ICollection>('Collection not found!', null, 404);
  }

  async getByAddressAsync(title: string): Promise<Result<ICollection>> {
    const data = await CollectionContext.findOne({ owner: title.toLowerCase() });
    if(data)
      return Result.success<ICollection>(null, data as ICollection);
    return Result.fail<ICollection>('Collection not found!', null, 404);
  }

  async patchCollection(request: ICollectionPatchRequest, id: number) {
    let responseResult: Result<ICollection> = Result.fail<ICollection>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    const sign = await signService.validate<ICollectionPatchRequestSignData>(request, request.data, 'collection_patch');
    if (!sign.isValid)
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    const result = await CollectionContext.findOne({
      blockchainId: id,
      account: sign.account
    });

    if(result) {
      return await this.updateAsync((result as CollectionDocument)._id, {
        avatar: request.data.avatar,
        description: request.data.description,
        api: request.data.api,
        website: request.data.website,
      });
    }

    return responseResult;    
  }

  async approveCollection(request: ICollectionApproveRequest, id: number, disapprove: boolean) {
    let responseResult: Result<ICollection> = Result.fail<ICollection>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    if (!(await signService.validate<ICollectionApproveRequestSignData>(request, request.data, 'approve_collection')).isValid)
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    const result = await CollectionContext.findOne({
      blockchainId: id
    });

    if(result && id.toString() === request.data.collectionId.toString()) {
      return await this.updateAsync((result as CollectionDocument)._id, {
        show: !disapprove,
        approvedBy: request.data.approvedBy
      });
    }

    return responseResult;    
  }

  async _fillUser(user: any, account: string, role: string) {
    const existingAccount = await UserContext.findOne({ account: account.toLowerCase() });

    user.role = role;

    if(existingAccount) {
      user.name = existingAccount.name || account;
      user.avatar = existingAccount.avatar;
      user.email = existingAccount.email;
      user.webSite = existingAccount.webSite;
      user.twitter = existingAccount.twitter;
      user.customProfile = existingAccount.customProfile;
      user.instagram = existingAccount.instagram;
    }
  }

  async createExternalNFTCollectionWithSign(request: ICollectionExternalNFTRequest): Promise<Result<ICollection>> {
    let responseResult: Result<ICollection> = Result.fail<ICollection>("The request is invalid.", null, 400);

    if (!request || !request.data)
      return responseResult;

    const signService = new SignService();
    if (!(await signService.validate<ICollectionExternalNFTRequestSignData>(request, request.data, 'collection_creation')).isValid)
      throw new Exception(400, "INVALID_SIGN", "The sent data is not valid!", null);

    if (!(await this._checkUniqueness(request.data))) {
      let result : Result<ICollection> | null = await this.getByAddressAsync(request.data.address);
      
      if (result.success && result.data && result.data.owner) {
        responseResult = result;
      } else {
        const collectionCreated = await this.createAsync(<ICollection>{
          title: request.data.name,
          namelc: request.data.name.toLowerCase(),
          show: false,
          description: request.data.name,
          isCustom: true,
          owner: request.data.address,
          account: request.data.account
        });

        if(collectionCreated.success) {
          const nftsAndImages = await Promise.all(request.data.nfts.map(async a => {
            const newNFT = {
              //HARD CODED ARTIST
              artist: {
                name: "Custom",
                address: request.data.address.toLowerCase(),
                website: "https://www.algopainter.art",
                twitter: "https://www.twitter.com/algopainter",
                github: "https://github.com/algopainter",
                instagram: "https://www.instagram.com/algopainter",
                avatar: "",
              },
              collectionHash: request.data.address.toLowerCase(),
              pirs: { creatorRate: null, investorRate: null },
              isRecovered: false,
              supplyIndex: a.id,
              contractAddress: request.data.address.toLowerCase(),
              description: a.description,
              mintedBy: request.data.account.toLowerCase(),
              owner: request.data.account.toLowerCase(),
              name: a.name || "N/A",
              collectionName: request.data.name,
              image: a.image,
              previewImage: a.image,
              rawImage: a.image,
              initialPrice: {
                amount: 0,
                tokenSymbol: "",
                tokenAddress: "",
              },
              parameters: a.params,
              descriptor: a.descriptor,
            };

            const createdNFT = await NFTContext.create(newNFT);

            const newImg = {
              title: newNFT.name,
              likes: 0,
              users: [] as any[],
              pirs: 0,
              creator: (newNFT.mintedBy || newNFT.artist.address).toLowerCase(),
              owner: (newNFT.mintedBy || newNFT.artist.address).toLowerCase(),
              description: newNFT.description,
              collectionName: newNFT.collectionName,
              collectionOwner: newNFT.contractAddress.toLowerCase(),
              collectionHash: newNFT.collectionHash.toLowerCase(),
              createdAt: new Date(),
              updatedAt: new Date(),
              nft: {
                _id: createdNFT._id.valueOf(),
                index: newNFT.supplyIndex,
                previewImage: newNFT.image,
                image: newNFT.image,
                rawImage: newNFT.image,
                parameters: newNFT.parameters
              },
              tags: [],
              likers: [],
              initialPrice: newNFT.initialPrice
            };

            let imgOwner = {
              name: newImg.owner.toLowerCase(),
              email: '',
              avatar: '',
              account: newImg.owner.toLowerCase(),
              webSite: '',
              twitter: '',
              customProfile: '',
              instagram: '',
              type: 'user',
              role: 'owner'
            };
        
            let imgCreator = {
              name: newImg.creator.toLowerCase(),
              avatar: '',
              email: '',
              account: newImg.creator.toLowerCase(),
              webSite: '',
              twitter: '',
              customProfile: '',
              instagram: '',
              type: 'user',
              role: 'creator'
            };
        
            await this._fillUser(imgOwner, newImg.owner, 'owner');
        
            if(newImg.creator != newImg.owner) {
              await this._fillUser(imgCreator, newImg.creator, 'creator');
            } else {
              imgCreator = { ...imgOwner };
              imgCreator.role = 'creator';
            }
        
            newImg.users.push(imgOwner);
            newImg.users.push(imgCreator);
        
            await ImageContext.create(newImg);

            return {
              nft: newNFT,
              image: newImg 
            }
          }));

          if(nftsAndImages && nftsAndImages.length) {
            responseResult = Result.success<ICollection>(null, null)
          }
        }
      }
    } else {
      responseResult = Result.custom<ICollection>(false, "The data sent is not unique!", null, 409, 390);
    }

    return responseResult;
  }

  private async _checkUniqueness(collectionInfo: ICollectionExternalNFTRequestSignData) {
    const foundCollections = await CollectionContext.find({
      owner: collectionInfo.address.toLowerCase()
    });

    return foundCollections.length > 0;
  }

  async createAsync(createdItem: ICollection): Promise<Result<ICollection>> {
    const input = await CollectionContext.create(createdItem);
    return Result.success<ICollection>(null, input as ICollection);
  }

  async updateAsync(id: string, updatedItem: Partial<ICollection>): Promise<Result<ICollection>> {
    const input = await CollectionContext.findByIdAndUpdate(id, updatedItem);
    return Result.success<ICollection>(null, (input as ICollection));
  }

}
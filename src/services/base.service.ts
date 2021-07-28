import Paged from "../shared/paged";
import Result from "../shared/result";
import MongoQS from 'mongo-querystring'
import { connect, Mongoose } from "mongoose";
import Settings from "../shared/settings";
import ISignBase from "../requests/sign.base";
import Web3 from 'web3';

export abstract class BaseService {
  /**
   * Connects to database
   */
  protected async _connect(): Promise<Mongoose> {
    return await connect(Settings.mongoURL(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  /**
   * Translate a filter to mongo query
   * @param filter 
   * @returns 
   */
  translateToMongoQuery(filter: IFilter): IFilter {
    const qs = new MongoQS();
    const query = Object.keys(filter).length ? qs.parse(filter) : null;
    return query;
  }

  /**
   * Translate an orederby to a mongo sort object
   * @param order 
   * @returns 
   */
  translateToMongoOrder(order: IOrderBy | null): unknown {
    if (order)
      return Object.keys(order).length ? order : { createdAt: -1 };
    return { createdAt: -1 };
  }

  /**
   * Validates the signature
   */
  validateSignature<T>(sign: ISignBase<T>, desired: T) : boolean {
    const web3 = new Web3();
    const signedHash = web3.eth.accounts.hashMessage(JSON.stringify(sign.data));
    const desiredSignedHash = web3.eth.accounts.hashMessage(JSON.stringify(desired));
    console.log(signedHash);
    console.log(desiredSignedHash);
    const signer = web3.eth.accounts.recover(signedHash, sign.signature, true);
    const signerLocal = web3.eth.accounts.recover(desiredSignedHash, sign.signature, true);
    console.log(signer);
    console.log(signerLocal);
    return signer == sign.account && signerLocal == sign.account;
  }
}

/**
 * Used to create concrete services
 */
export abstract class BaseCRUDService<T> extends BaseService {
  abstract listAsync(filter: IFilter | null, order: IOrderBy | null)
    : Promise<Result<T[]>>;

  abstract pagedAsync(filter: IFilter | null, order: IOrderBy | null, page: number | null, perPage: number | null)
    : Promise<Result<Paged<T>>>;

  abstract getAsync(id: string)
    : Promise<Result<T>>;

  abstract createAsync(createdItem: T)
    : Promise<Result<T>>;

  abstract updateAsync(updatedItem: T)
    : Promise<Result<T>>;
}

export interface IFilter {
  [name: string]: string | undefined
}

export interface IOrderBy {
  [name: string]: string | undefined
}
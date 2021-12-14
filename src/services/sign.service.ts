/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISign, SignContext } from "../domain/sign";
import Result from "../shared/result";
import { BaseService } from "./base.service";
import Web3 from 'web3';

export default class SignService extends BaseService {
  /**
   * Validates the signature
   */
  async validate<T>(sign: ISign<T>, desired: T, action: string): Promise<boolean> {
    if (Object.prototype.hasOwnProperty.call(sign.data, 'salt')) {
      if (sign.salt != (<any>sign.data).salt)
        return false;
    }

    const web3 = new Web3();
    const signedHash = web3.eth.accounts.hashMessage(JSON.stringify(sign.data));
    const desiredSignedHash = web3.eth.accounts.hashMessage(JSON.stringify(desired));
    const signer = web3.eth.accounts.recover(signedHash, sign.signature, true);
    const signerLocal = web3.eth.accounts.recover(desiredSignedHash, sign.signature, true);
    const isValid = signer.toLowerCase() == sign.account.toLowerCase() &&
      signerLocal.toLowerCase() == sign.account.toLowerCase();

    if (isValid) {
      await this.createAsync({
        account: sign.account,
        createdAt: new Date(),
        data: sign.data,
        salt: sign.salt,
        signature: sign.signature,
        action
      });
    }

    return isValid;
  }

  async validatePreRequest(metadata: Record<string, any>): Promise<boolean | null> {
    const objKeys = Object.keys(metadata);
    let hasSalt = false;
    let hasData = false;
    const possibleSignData: Record<string, any> = {};

    for (const key in objKeys) {
      if (objKeys[key] == 'salt') {
        possibleSignData[objKeys[key]] = metadata[objKeys[key]];
        hasSalt = true;
      }

      if (objKeys[key] == 'data') {
        possibleSignData[objKeys[key]] = metadata[objKeys[key]];
        hasData = true;
        if (!possibleSignData[objKeys[key]].salt)
          hasSalt = false;
      }
    }

    if (hasData && hasSalt) {
      if (possibleSignData['salt'] != possibleSignData['data'].salt)
        return false;
      const salt = possibleSignData['salt'];
      return !await this._existSalt(salt);
    }
    return null
  }

  async createAsync<T>(sign: ISign<T>): Promise<Result<ISign<T>>> {
    await SignContext.create(sign);
    return Result.success<ISign<T>>(null, null);
  }

  private async _existSalt(salt: string): Promise<boolean> {
    const found = await SignContext.findOne({ 'salt': salt });
    if (found && found._id)
      return true;
    return false;
  }
}
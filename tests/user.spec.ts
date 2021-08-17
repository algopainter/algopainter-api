/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { nanoid } from 'nanoid';
import Web3 from 'web3';
import { IImage } from '../src/domain/image';
import { IUser } from '../src/domain/user';
import Paged from '../src/shared/paged';
import Result from '../src/shared/result';
import EndpointTest from './api.wrapper';

describe("'api/users' endpoint tests", () => {
  const client = new EndpointTest("/api/users");

  it('PUT|GET /api/users/:account', async function () {
    const nid = nanoid();
    const web3 = new Web3();
    const accountInfo = web3.eth.accounts.create();
    const data = {
      name: "Rodrigo Coura",
      email: `a+${Math.floor(Math.random() * 1000)}@a.com`,
      customProfile: `lincolnquerProducaohj${Math.floor(Math.random() * 1000)}`,
      avatar: "",
      webSite: "google.com.br",
      bio: "bio, test, good",
      facebook: "rodrigo",
      instagram: "rodrigo",
      twitter: "rodrigo",
      telegram: "rodrigo",
      gmail: "rodrigo",
      salt: nid
    };
    const signature = accountInfo.sign(JSON.stringify(data));

    const userPutRequest = {
      data,
      salt: nid,
      account: accountInfo.address.toLowerCase(),
      signature: signature.messageHash
    };

    await client.AssertPut(`/${accountInfo.address.toLowerCase()}`, userPutRequest, 200);

    const insertedUser = await client.AssertGet<IUser>(`/${accountInfo.address.toLowerCase()}`, 200);

    expect(insertedUser).not.be.undefined;
    expect(insertedUser).not.be.null;
    expect(insertedUser?.account).be.equal(accountInfo.address.toLowerCase());
    expect(insertedUser?.email).be.equal(data.email);
    expect(insertedUser?.customProfile).be.equal(data.customProfile);
  });

  it('GET /api/users/:account/images?page=1&perPage=1', async function () {
    const imgClient = new EndpointTest("/api/images");
    const resImages = await imgClient.AssertGet<IImage[]>('?nft.index=420', 200);

    if (resImages && resImages[0]) {
      const resUsersImages = await client.AssertGet<Paged<IImage>>(`/${resImages[0].owner}/images?page=1&perPage=1`, 200);

      if (resUsersImages) {
        expect(resUsersImages.currPage).to.be.equal(1);
        expect(resUsersImages.count).to.be.greaterThanOrEqual(resUsersImages.currPage * resUsersImages.pages);
        expect(resUsersImages.data?.length).to.be.equal(1);
        expect(resUsersImages.data?.every(a => a.owner === resImages[0].owner)).to.be.true;
      } else {
        expect(false, "The unit test failed!").to.be.true;
      }
    } else {
      expect(false, "The unit test failed!").to.be.true;
    }
  });

  it('PUT /api/users Duplicated Data', async function () {
    const nid = nanoid();
    const web3 = new Web3();
    let accountInfo = web3.eth.accounts.create();
    const data = {
      name: "Rodrigo Coura",
      email: `a+${Math.floor(Math.random() * 100000)}@a.com`,
      customProfile: `lincolnquerProducaohj${Math.floor(Math.random() * 100000)}`,
      avatar: "",
      webSite: "google.com.br",
      bio: "bio, test, good",
      facebook: "rodrigo",
      instagram: "rodrigo",
      twitter: "rodrigo",
      telegram: "rodrigo",
      gmail: "rodrigo",
      salt: nid
    };
    let signature = accountInfo.sign(JSON.stringify(data));

    let userPutRequest = {
      data,
      salt: nid,
      account: accountInfo.address.toLowerCase(),
      signature: signature.messageHash
    };

    await client.AssertPut(`/${accountInfo.address.toLowerCase()}`, userPutRequest, 200);

    //try insert again with same data with diff account

    accountInfo = web3.eth.accounts.create();
    data.salt = nanoid();
    signature = accountInfo.sign(JSON.stringify(data));

    userPutRequest = {
      data,
      salt: data.salt,
      account: accountInfo.address.toLowerCase(),
      signature: signature.messageHash
    };

    //should receive 409
    const errorResult = await client.AssertPut<Result<IUser>>(`/${accountInfo.address.toLowerCase()}`, userPutRequest, 409);

    expect(errorResult).not.be.null;
    expect(errorResult?.code).be.eql(390);
  });
});
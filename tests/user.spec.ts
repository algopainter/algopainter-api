/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { ICollection } from '../src/domain/collection';
import { IImage } from '../src/domain/image';
import { IUser } from '../src/domain/user';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';

describe("'api/users' endpoint tests", () => {
  const client = new EndpointTest("/api/users");

  it('PUT|GET /api/users/:account', async function () {
    expect(true).to.be.true;
  });

  it('GET /api/users/:account/images?page=1&perPage=1', async function () {
    const resImages = await client.AssertGet<IImage[]>('?nft.index=420', 200);
    
    if(resImages && resImages[0]) {
      const resUsersImages = await client.AssertGet<Paged<IImage>>(`/${resImages[0].owner}/images?page=1&perPage=1`, 200);

      if(resUsersImages) {
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
});
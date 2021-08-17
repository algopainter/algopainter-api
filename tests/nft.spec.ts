import { expect } from 'chai';
import { INFT } from '../src/domain/nft';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';

describe("'api/blockchain/nfts' endpoint tests", () => {
  const client = new EndpointTest("/api/blockchain/nfts");

  it('GET /api/blockchain/nfts', async function () {
    const res = await client.AssertGet<INFT[]>('', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/blockchain/nfts?page=1&perPage=1', async function () {
    const res = await client.AssertGet<Paged<INFT>>('?page=1&perPage=1', 200);
    if(res) {
      expect(res.currPage).to.be.equal(1);
      expect(res.count).to.be.greaterThanOrEqual(res.currPage * res.pages);
      expect(res.data?.length).to.be.equal(1);
    } else {
      expect(res).to.be.null;
    }
  });
  
});
import { expect } from 'chai';
import { IAuction } from '../src/domain/auction';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';

describe("'api/auctions' endpoint tests", () => {
  const client = new EndpointTest("/api/auctions");

  it('GET /api/auctions', async function () {
    const res = await client.AssertGet<IAuction[]>('', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/auctions?page=1&perPage=1', async function () {
    const res = await client.AssertGet<Paged<IAuction>>('?page=1&perPage=2', 200);
    if(res) {
      expect(res.currPage).to.be.equal(1);
      expect(res.count).to.be.greaterThanOrEqual(res.currPage * res.pages);
      expect(res.data?.length).to.be.equal(2);
    } else {
      expect(res).to.be.null;
    }
  });
  
});
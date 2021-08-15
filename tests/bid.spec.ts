import { expect } from 'chai';
import { IBid } from '../src/domain/bid';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';

describe("'api/bids' endpoint tests", () => {
  const client = new EndpointTest("/api/bids");

  it('GET /api/bids', async function () {
    const res = await client.AssertGet<IBid[]>('', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/bids?page=1&perPage=1', async function () {
    const res = await client.AssertGet<Paged<IBid>>('?page=1&perPage=1', 200);
    if(res) {
      expect(res.currPage).to.be.equal(1);
      expect(res.count).to.be.greaterThanOrEqual(res.currPage * res.pages);
      expect(res.data?.length).to.be.equal(1);
    } else {
      expect(res).to.be.null;
    }
  });
  
});
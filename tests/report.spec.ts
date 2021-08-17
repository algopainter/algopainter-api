import { expect } from 'chai';
import { IBuyer } from '../src/reporting/buyers';
import { ISeller } from '../src/reporting/sellers';
import EndpointTest from './api.wrapper';

describe("'api/reports' endpoint tests", () => {
  const client = new EndpointTest("/api/reports");

  it('GET /api/reports/top/sellers', async function () {
    const res = await client.AssertGet<ISeller[]>('/top/sellers', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/reports/top/buyers', async function () {
    const res = await client.AssertGet<IBuyer[]>('/top/buyers', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });
  
});
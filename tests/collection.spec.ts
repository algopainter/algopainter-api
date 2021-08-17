/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { ICollection } from '../src/domain/collection';
import { IImage } from '../src/domain/image';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';

describe("'api/collections' endpoint tests", () => {
  const client = new EndpointTest("/api/collections");

  it('GET /api/collections', async function () {
    const res = await client.AssertGet<ICollection[]>('', 200);
    if (res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/collections?page=1&perPage=1', async function () {
    const res = await client.AssertGet<Paged<ICollection>>('?page=1&perPage=1', 200);
    if (res) {
      expect(res.currPage).to.be.equal(1);
      expect(res.count).to.be.greaterThanOrEqual(res.currPage * res.pages);
      expect(res.data?.length).to.be.equal(1);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/collections/:id/images?page=1&perPage=1', async function () {
    const resCollection = await client.AssertGet<ICollection[]>('', 200);
    if (resCollection) {
      expect(resCollection.length).to.be.greaterThan(0);
      const resCollectionImages = await client.AssertGet<Paged<IImage>>(`/${(resCollection[0] as any)._id.toString()}/images?page=1&perPage=1`, 200);
      if (resCollectionImages) {
        expect(resCollectionImages.currPage).to.be.equal(1);
        expect(resCollectionImages.count).to.be.greaterThanOrEqual(resCollectionImages.currPage * resCollectionImages.pages);
        expect(resCollectionImages.data?.length).to.be.equal(1);
        expect(resCollectionImages.data?.every(a => a.collectionOwner === resCollection[0].owner)).to.be.true;
      } else {
        expect(resCollectionImages).to.be.null;
      }
    } else {
      expect(resCollection).to.be.null;
    }
  });

  it('GET /api/collections/:id/images', async function () {
    const resCollection = await client.AssertGet<ICollection[]>('', 200);
    if (resCollection) {
      expect(resCollection.length).to.be.greaterThan(0);
      const resCollectionImages = await client.AssertGet<IImage[]>(`/${(resCollection[0] as any)._id.toString()}/images`, 200);
      if (resCollectionImages) {
        expect(resCollectionImages.length).to.be.greaterThan(0);
        expect(resCollectionImages.every(a => a.collectionOwner === resCollection[0].owner)).to.be.true;
      } else {
        expect(resCollectionImages).to.be.null;
      }
    } else {
      expect(resCollection).to.be.null;
    }
  });
});
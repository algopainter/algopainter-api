import { expect } from 'chai';
import { nanoid } from 'nanoid';
import { IImage } from '../src/domain/image';
import Paged from '../src/shared/paged';
import EndpointTest from './api.wrapper';
import Web3 from 'web3';

describe("'api/images' endpoint tests", () => {
  const client = new EndpointTest("/api/images");

  it('GET /api/images', async function () {
    const res = await client.AssertGet<IImage[]>('', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/images?page=1&perPage=1', async function () {
    const res = await client.AssertGet<Paged<IImage>>('?page=1&perPage=1', 200);
    if(res) {
      expect(res.currPage).to.be.equal(1);
      expect(res.count).to.be.greaterThanOrEqual(res.currPage * res.pages);
      expect(res.data?.length).to.be.equal(1);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/images?nft.index=420', async function () {
    const res = await client.AssertGet<IImage[]>('?nft.index=420', 200);
    if(res) {
      expect(res.length).to.be.equal(1);
      expect(res[0].nft.index).to.be.equal(420);
    } else {
      expect(res).to.be.null;
    }
  });

  it('GET /api/images?order.nft.index=-1', async function () {
    const res = await client.AssertGet<IImage[]>('?order.nft.index=-1', 200);
    if(res) {
      expect(res.length).to.be.greaterThan(0);
      expect(res[0].nft.index).not.to.be.equal(1);
    } else {
      expect(res).to.be.null;
    }
  });

  it('PUT /api/images/:id/likes', async function () {
    this.timeout(10000000);
    const resImages = await client.AssertGet<IImage[]>('?nft.index=420', 200);
    if(resImages) {
      if (resImages) {
        expect(resImages.length).to.be.greaterThan(0);
        const nid = nanoid();
        const web3 = new Web3();
        const accountInfo = web3.eth.accounts.create();
        const data = {
          imageId: (resImages[0] as any)._id.toString(),
          salt: nid
        };
        const signature = accountInfo.sign(JSON.stringify(data));
        
        const likeRequest = {
          data,
          salt: nid,
          account: accountInfo.address.toLowerCase(),
          signature: signature.messageHash
        };
        
        await client.AssertPost<null>(`/${data.imageId}/likes`, likeRequest, 200);

        const updatedImage = await client.AssertGet<IImage>(`/${data.imageId}`, 200);

        expect(updatedImage).not.be.null

        if(updatedImage) {
          console.log(updatedImage)
          expect(updatedImage.likes).to.be.greaterThan(resImages[0].likes);
          expect(updatedImage.likers?.some(a => a.toLowerCase() == accountInfo.address.toLowerCase())).to.be.true;
        }
      } 
    } else {
      expect(resImages).to.be.null;
    }
  });
  
});
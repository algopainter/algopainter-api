/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from 'nanoid';
import Netlify from '../providers/netlify'
import { auctionTestData } from '../reference';
import AuctionService from '../services/auction-service';
import Result from '../shared/result'

const handler = Netlify.createHandler<any>(
  async (json, queryString): Promise<Result<any>> => {
    // const service = new AuctionService();
    // await service.createAsync(auctionTestData);
    return Result.success<any>("AlgoPainter API!", null);
  }
);

export { handler }
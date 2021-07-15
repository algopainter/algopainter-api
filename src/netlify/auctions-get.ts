import { IAuction } from '../domain/auction'
import Netlify from '../providers/netlify'
import AuctionService from '../services/auction-service';
import Result from '../shared/result'

const handler = Netlify.createHandler<IAuction>(
  async (json, queryString): Promise<Result<IAuction>> => {
    const service = new AuctionService();
    console.log(queryString);
    return await service.getAsync(queryString);
  }
);

export { handler }
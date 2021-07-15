import { IAuction } from '../domain/auction'
import Netlify from '../providers/netlify'
import AuctionService from '../services/auction-service';
import { IFilter, IOrderBy } from '../services/base-service';
import Paged from '../shared/paged';
import QueryParser from '../shared/query-parser';
import Result from '../shared/result'

const handler = Netlify.createHandler<Paged<IAuction>>(
  async (json, queryString): Promise<Result<Paged<IAuction>>> => {
    const service = new AuctionService();
    const page = queryString.page ? parseInt(queryString.page) : 1;
    const perPage = queryString.perPage ? parseInt(queryString.perPage) : 10;
    delete queryString.page;
    delete queryString.perPage;
    const order: IOrderBy = QueryParser.parseByPrefix('order', queryString);
    const filter: IFilter = QueryParser.parseExcludePrefix('order', queryString);
    return await service.pagedAsync(filter, order, page, perPage);
  }
);

export { handler }
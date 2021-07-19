import { Router } from "express";
import { IAuction } from "src/domain/auction";
import Paged from "src/shared/paged";
import Result from "src/shared/result";
import AuctionService from "../services/auction-service";
import { IFilter, IOrderBy } from "../services/base-service";
import QueryParser from "../shared/query-parser";
import { BaseController } from "./base-controller"

class AuctionController extends BaseController {
  private service: AuctionService;

  constructor() {
    super();
    this.service = new AuctionService();
  }

  get path() : string {
    return "/auctions"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}`, async (req, res) => {
      try {
        const page = req.query['page']?.toString() || '-1';
        const perPage = req.query['perPage']?.toString() || '-1';

        //Remove for later do not threat as mongo db field
        delete req.query['page'];
        delete req.query['perPage'];

        const order: IOrderBy = QueryParser.parseByPrefix('order', req.query);
        const filter: IFilter = QueryParser.parseExcludePrefix('order', req.query);
        
        let result : Result<Paged<IAuction>> | Result<IAuction[]> | null = null;
        if(page === '-1' || perPage === '-1') {
          result = await this.service.listAsync(filter, order);
        } else {
          result = await this.service.pagedAsync(filter, order, parseInt(page), parseInt(perPage));
        }
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });

    router.get(`${this.path}/:id`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });
  }
}

export default AuctionController;
import { Router } from "express";
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
    return "/auction"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}/:id`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });

    router.get(`${this.path}s/:page/:perPage`, async (req, res) => {
      try {
        const order: IOrderBy = QueryParser.parseByPrefix('order', req.query);
        const filter: IFilter = QueryParser.parseExcludePrefix('order', req.query);
        const result = await this.service.pagedAsync(filter, order, parseInt(req.params.page), parseInt(req.params.perPage));
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });
  }
}

export default AuctionController;
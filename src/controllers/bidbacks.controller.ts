import { Router } from "express";
import { IAuction } from "../domain/auction";
import Paged from "../shared/paged";
import Result from "../shared/result";
import AuctionService from "../services/auction.service";
import BaseController from "./base.controller"

class BidbacksController extends BaseController {
  private service: AuctionService;

  constructor() {
    super();
    this.service = new AuctionService();
  }

  get path() : string {
    return "/bidbacks"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}/:account/auctions`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<IAuction>> | Result<IAuction[]> | null = null;
        if(params.paging.page === -1 || params.paging.perPage === -1) {
          result = await this.service.listBidbacksAsync(req.params.account, params.filter, params.order);
        } else {
          result = await this.service.pagedBidbacksAsync(
            req.params.account,
            params.filter, 
            params.order, 
            params.paging.page, 
            params.paging.perPage
          );
        }
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default BidbacksController;
import { Router } from "express";
import { IBid } from "../domain/bid";
import BidService from "../services/bid.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller"

class BidController extends BaseController {
  private service: BidService;

  constructor() {
    super();
    this.service = new BidService();
  }

  get path() : string {
    return "/bids"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<IBid>> | Result<IBid[]> | null = null;
        if(params.paging.page === -1 || params.paging.page === -1) {
          result = await this.service.listAsync(params.filter, params.order);
        } else {
          result = await this.service.pagedAsync(
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

    router.get(`${this.path}/:id`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default BidController;
import { Router } from "express";
import { IAuction } from "../domain/auction";
import Paged from "../shared/paged";
import Result from "../shared/result";
import AuctionService from "../services/auction.service";
import BaseController from "./base.controller"

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
        const params = this.requestParams(req);
        let result : Result<Paged<IAuction>> | Result<IAuction[]> | null = null;
        if(params.paging.page === -1 || params.paging.perPage === -1) {
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

export default AuctionController;
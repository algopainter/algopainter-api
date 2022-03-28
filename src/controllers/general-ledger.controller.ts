import { Router } from "express";
import { IAuction } from "../domain/auction";
import Paged from "../shared/paged";
import Result from "../shared/result";
import AuctionService from "../services/auction.service";
import BaseController from "./base.controller"
import GeneralLedgerService from "../services/general-ledger.service";

class GeneralLedgerController extends BaseController {
  private service: GeneralLedgerService;

  constructor() {
    super();
    this.service = new GeneralLedgerService();
  }

  get path() : string {
    return "/gls"
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

    router.get(`${this.path}/:id/bids`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(Result.success(null, result.data?.bids), res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default GeneralLedgerController;
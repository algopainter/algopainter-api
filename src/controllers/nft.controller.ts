import { Router } from "express";
import { INFT } from "../domain/nft";
import NFTService from "../services/nft.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller"

class NFTController extends BaseController {
  private service: NFTService;

  constructor() {
    super();
    this.service = new NFTService();
  }

  get path() : string {
    return "/blockchain/nfts"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<INFT>> | Result<INFT[]> | null = null;
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

export default NFTController;
import { Router } from "express";
import Exception from "src/shared/exception";
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
        this.handleException(error as Error | Exception, res);
      }
    });

    router.get(`${this.path}/:id`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error as Error | Exception, res);
      }
    });

    router.get(`${this.path}/:contract/:tokenId`, async (req, res) => {
      try {
        const result = await this.service.getByTokenIdAsync(parseInt(req.params.tokenId), req.params.contract);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error as Error | Exception, res);
      }
    });

    router.get(`${this.path}/:contract/owners/:tokenId`, async (req, res) => {
      try {
        const result = await this.service.getOwnersByTokenIdAsync(parseInt(req.params.tokenId), req.params.contract);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error as Error | Exception, res);
      }
    });
  }
}

export default NFTController;
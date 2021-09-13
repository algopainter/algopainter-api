import { Router } from "express";
import { IImage } from "../domain/image";
import ImageService from "../services/image.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller";

class HistoryController extends BaseController {
  private imgSvc: ImageService;

  constructor() {
    super();
    this.imgSvc = new ImageService();
  }

  get path() : string {
    return "/histories"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}/owners/:account/images`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<IImage>> | Result<IImage[]> | null = null;
        if(params.paging.page === -1 || params.paging.perPage === -1) {
          result = await this.imgSvc.listImagesIWasOwnerAsync(req.params.account);
        } else {
          result = await this.imgSvc.pagedImagesIWasOwnerAsync(
            req.params.account,
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

export default HistoryController;
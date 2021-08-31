import { Router } from "express";
import { IImage } from "../domain/image";
import ImageService from "../services/image.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller"

class LikeController extends BaseController {
  private service: ImageService;

  constructor() {
    super();
    this.service = new ImageService();
  }

  get path() : string {
    return "/likes"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}/:account`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<IImage>> | Result<IImage[]> | null = null;
        if(params.paging.page === -1 || params.paging.perPage === -1) {
          result = await this.service.listLikedBy(req.params.account, params.filter, params.order);
        } else {
          result = await this.service.pagedLikedByAsync(
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

export default LikeController;
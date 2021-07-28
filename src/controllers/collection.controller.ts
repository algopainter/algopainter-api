import { Router } from "express";
import { ICollection } from "../domain/collection";
import CollectionService from "../services/collection.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller"

class CollectionController extends BaseController {
  private service: CollectionService;

  constructor() {
    super();
    this.service = new CollectionService();
  }

  get path() : string {
    return "/collections"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<ICollection>> | Result<ICollection[]> | null = null;
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

    router.get(`${this.path}/:id/images`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        if(result && result.data) {
          const imagesResult = Result.success(null, result.data.images);
          this.handleResult(imagesResult, res);
        }
        res.status(404).send();
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default CollectionController;
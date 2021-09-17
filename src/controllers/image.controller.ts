import { Router } from "express";
import { IImage } from "../domain/image";
import ImageService from "../services/image.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller"

class ImageController extends BaseController {
  private service: ImageService;

  constructor() {
    super();
    this.service = new ImageService();
  }

  get path() : string {
    return "/images"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result : Result<Paged<IImage>> | Result<IImage[]> | null = null;
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

    router.get(`${this.path}/:id/owners`, async (req, res) => {
      try {
        const result = await this.service.getOwnersOfAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.post(`${this.path}/:id/likes`, async (req, res) => {
      try {
        const result = await this.service.likeAsync(req.params.id, req.body);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.delete(`${this.path}/:id/likes`, async (req, res) => {
      try {
        const result = await this.service.dislikeAsync(req.params.id, req.query.payload != null ? JSON.parse(req.query.payload.toString()) : null);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default ImageController;
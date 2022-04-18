import { Router } from "express";
import ImageService from "../services/image.service";
import { ICollection } from "../domain/collection";
import CollectionService from "../services/collection.service";
import Paged from "../shared/paged";
import Result from "../shared/result";
import BaseController from "./base.controller"
import { IImage } from "../domain/image";
import { ICollectionApproveRequest, ICollectionExternalNFTRequest, ICollectionPatchRequest, ICollectionUpdateCreateRequest } from "../requests/collection.create.update.request";


class CollectionController extends BaseController {
  private service: CollectionService;
  private imgService: ImageService;

  constructor() {
    super();
    this.service = new CollectionService();
    this.imgService = new ImageService();
  }

  get path(): string {
    return "/collections"
  }

  intializeRoutes(router: Router): void {
    router.get(`${this.path}/custom/all`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result: Result<Paged<ICollection>> | Result<ICollection[]> | null = null;
        if (params.paging.page === -1 || params.paging.page === -1) {
          result = await this.service.listAsync2(params.filter, params.order);
        } else {
          result = await this.service.pagedAsync2(
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

    router.post(`${this.path}`, async (req, res) => {
      try {
        const result = await this.service.createExternalNFTCollectionWithSign(req.body as ICollectionExternalNFTRequest);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.patch(`${this.path}/:collectionId`, async (req, res) => {
      try {
        const result = await this.service.patchCollection(req.body as ICollectionPatchRequest, parseInt(req.params.collectionId));
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.put(`${this.path}/:collectionId/approve`, async (req, res) => {
      try {
        const result = await this.service.approveCollection(req.body as ICollectionApproveRequest, parseInt(req.params.collectionId), false);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.put(`${this.path}/:collectionId/disapprove`, async (req, res) => {
      try {
        const result = await this.service.approveCollection(req.body as ICollectionApproveRequest, parseInt(req.params.collectionId), true);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}`, async (req, res) => {
      try {
        const params = this.requestParams(req);
        let result: Result<Paged<ICollection>> | Result<ICollection[]> | null = null;
        if (params.paging.page === -1 || params.paging.page === -1) {
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

    router.get(`${this.path}/db/:id`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/:id/images`, async (req, res) => {
      try {
        const resultCollection = await this.service.getAsync(req.params.id);
        if (resultCollection && resultCollection.data) {
          delete req.query.id;
          if(resultCollection.data.blockchainId)
            req.query.collectionId = '|NO_PARSE|' + (resultCollection.data as ICollection)?.blockchainId?.toString();
          else
            req.query.collectionOwner = (resultCollection.data as ICollection).owner;
          const params = this.requestParams(req);
          let result: Result<Paged<IImage>> | Result<IImage[]> | null = null;
          if (params.paging.page === -1 || params.paging.page === -1) {
            result = await this.imgService.listAsync(params.filter, params.order);
          } else {
            result = await this.imgService.pagedAsync(
              params.filter,
              params.order,
              params.paging.page,
              params.paging.perPage
            );
          }
          this.handleResult(result, res);
        } else {
          this.handleResult(Result.failure(null, null, 404), res);
        }
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default CollectionController;
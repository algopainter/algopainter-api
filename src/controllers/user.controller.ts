import { Router } from "express";
import { IImage } from "../domain/image";
import Paged from "../shared/paged";
import Result from "../shared/result";
import { IUserUpdateRequest } from "../requests/user.update.request";
import ImageService from "../services/image.service";
import UserService from "../services/user.service";
import BaseController from "./base.controller"

class UserController extends BaseController {
  private service: UserService;
  private imageService: ImageService;

  constructor() {
    super();
    this.service = new UserService();
    this.imageService = new ImageService();
  }

  get path(): string {
    return "/users"
  }

  intializeRoutes(router: Router): void {
    router.get(`${this.path}/:account`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.account.toLowerCase());
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/:account/images`, async (req, res) => {
      try {
        if (req.params.account) {
          delete req.query.id;
          delete req.query.account;

          const includeExpiredAuctions = this.getBoolean(req.query.includeExpired);
          delete req.query.includeExpired;
          const params = this.requestParams(req);

          const result = await this.imageService.getByOwnerCountingAuctions(
            req.params.account,
            params.filter,
            params.order,
            params.paging.page,
            params.paging.perPage,
            includeExpiredAuctions
          )

          this.handleResult(result, res);
        } else {
          this.handleResult(Result.failure(null, null, 404), res);
        }
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.put(`${this.path}/:account`, async (req, res) => {
      try {
        const result = await this.service.updateUser(req.params.account.toLowerCase(), req.body as IUserUpdateRequest);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/:customProfile/account`, async (req, res) => {
      try {
        const result = await this.service.getAccountByCustomUrl(req.params.customProfile);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/:account/auctions/biding`, async (req, res) => {
      try {
        const forBidbacks = req.query.forBidbacks ? this.getBoolean(req.query.forBidbacks) : null;
        const hasBidbacks = req.query.hasBidbacks ? this.getBoolean(req.query.hasBidbacks) : null;
        const hasPirs = req.query.hasPirs ? this.getBoolean(req.query.hasPirs) : null;
        delete req.query.hasBidbacks;
        delete req.query.hasPirs;
        delete req.query.forBidbacks;
        const params = this.requestParams(req);
        const result = await this.service.getAuctionsThatUserBidAsync(
          req.params.account, 
          params.paging.page, 
          params.paging.perPage,
          params.filter,
          params.order,
          hasPirs,
          hasBidbacks,
          forBidbacks);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default UserController;
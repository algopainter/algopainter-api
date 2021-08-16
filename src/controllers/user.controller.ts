import { Router } from "express";
import { IImage } from "../domain/image";
import { IUser } from "../domain/user";
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

  get path() : string {
    return "/users"
  }

  intializeRoutes(router : Router) : void {
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
        const resultUsers = await this.service.getAsync(req.params.account.toLowerCase());
        if (resultUsers && resultUsers.data) {
          delete req.query.id;
          delete req.query.account;
          req.query.owner = (resultUsers.data as IUser).account.toLowerCase();
          const params = this.requestParams(req);
          let result: Result<Paged<IImage>> | Result<IImage[]> | null = null;
          if (params.paging.page === -1 || params.paging.page === -1) {
            result = await this.imageService.listAsync(params.filter, params.order);
          } else {
            result = await this.imageService.pagedAsync(
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

    router.put(`${this.path}/:account`, async (req, res) => {
      try {
        const result = await this.service.updateUser(req.params.account.toLowerCase(), req.body as IUserUpdateRequest);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default UserController;
import { Router } from "express";
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
        const images = await this.imageService.getByOwnerAsync(req.params.account.toLowerCase());
        this.handleResult(images, res);
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
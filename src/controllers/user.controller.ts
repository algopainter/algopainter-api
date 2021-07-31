import { Router } from "express";
import { UserDocument } from "src/domain/user";
import { IUserUpdateRequest } from "src/requests/user.update.request";
import UserService from "../services/user.service";
import BaseController from "./base.controller"

class UserController extends BaseController {
  private service: UserService;

  constructor() {
    super();
    this.service = new UserService();
  }

  get path() : string {
    return "/users"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}/:account`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.account);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.put(`${this.path}/:account`, async (req, res) => {
      try {
        const result = await this.service.updateUser(req.params.account, req.body as IUserUpdateRequest);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default UserController;
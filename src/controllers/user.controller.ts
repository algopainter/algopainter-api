import { Router } from "express";
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
    router.get(`${this.path}/:id`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.id);
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });
  }
}

export default UserController;
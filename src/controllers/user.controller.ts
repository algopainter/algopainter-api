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
    router.get(`${this.path}/:account`, async (req, res) => {
      try {
        const result = await this.service.getAsync(req.params.account);
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });

    router.post(`${this.path}`, async (req, res) => {
      res.status(200).send(req.body);
    });

    router.put(`${this.path}/:account`, async (req, res) => {
      res.status(200).send(req.body);
    });

    router.delete(`${this.path}/:account`, async (req, res) => {
      res.status(200).send(req.body);
    });
  }
}

export default UserController;
import { Router } from "express";
import ReportService from "../services/report.service";
import BaseController from "./base.controller"

class ReportController extends BaseController {
  private service: ReportService;

  constructor() {
    super();
    this.service = new ReportService();
  }

  get path() : string {
    return "/reports"
  }

  intializeRoutes(router : Router) : void {
    router.get(`${this.path}/top/sellers`, async (req, res) => {
      try {
        const result = await this.service.topSellers();
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });

    router.get(`${this.path}/top/buyers`, async (req, res) => {
      try {
        const result = await this.service.topBuyers();
        this.handleResult(result, res);
      } catch (error) {
        this.handleResult(error, res);
      }
    });
  }
}

export default ReportController;
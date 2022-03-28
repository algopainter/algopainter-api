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
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/top/buyers`, async (req, res) => {
      try {
        const result = await this.service.topBuyers();
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/artist/:artist/mints`, async (req, res) => {
      try {
        const result = await this.service.artistMints(req.params.artist);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
    

    router.get(`${this.path}/artist/:artist/auctions`, async (req, res) => {
      try {
        const result = await this.service.artistAuctions(req.params.artist);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/user/:account/auctions`, async (req, res) => {
      try {
        const result = await this.service.userAuctions(req.params.account);
        this.handleResult(result, res);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default ReportController;
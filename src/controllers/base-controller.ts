import { Router, Request, Response } from "express";
import Result from "../shared/result";
import Exception from "../shared/exception";

abstract class BaseController {
  abstract get path(): string;
  abstract intializeRoutes(router: Router): void;

  handleResult<T>(actionResult: Result<T>, res: Response<unknown, Record<string, unknown>>): void {
    try {
      if (actionResult.success) {
        res.status(200).send(actionResult.data || actionResult.message)
      } else {
        res.status(400).send(actionResult.data || actionResult.message)
      }
    } catch (ex) {
      console.log(ex);
      if (ex instanceof Exception) {
        res.status(400).send(ex.formattedMessage);
      } else {
        res.status(500).send(ex.toString());
      }
    }
  }

  handleException(ex: Error | Exception, res: Response<unknown, Record<string, unknown>>): void {
    if (ex instanceof Exception) {
      res.status(400).send(ex.formattedMessage);
    } else {
      res.status(500).send(ex.toString());
    }
  }
}

export { BaseController };
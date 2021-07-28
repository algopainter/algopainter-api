/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Router, Request, Response } from "express";
import Result from "../shared/result";
import Exception from "../shared/exception";
import { IFilter, IOrderBy } from "src/services/base.service";
import QueryParser from "../shared/query-parser";

export default abstract class BaseController {
  abstract get path(): string;
  abstract intializeRoutes(router: Router): void;

  pageParams(req: Request<any, any, any, any, any>) : IPageParams {
    const page = parseInt(req.query['page']?.toString() || '-1');
    const perPage = parseInt(req.query['perPage']?.toString() || '-1');

    //Remove for later do not threat as mongo db field
    delete req.query['page'];
    delete req.query['perPage'];

    return { page, perPage }
  }

  orderParams(req: Request<any, any, any, any, any>) : IOrderBy {
    return QueryParser.parseByPrefix('order', req.query);
  }

  filterParams(req: Request<any, any, any, any, any>) : IOrderBy {
    return QueryParser.parseExcludePrefix('order', req.query);
  }

  requestParams(req: Request<any, any, any, any, any>) : IRequestParams {
    const paging = this.pageParams(req);
    const order = this.orderParams(req);
    const filter = this.filterParams(req);

    return {
      paging, order, filter
    }
  }

  handleResult(actionResult: Result<unknown> | null, res: Response<unknown, Record<string, unknown>>): void {
    try {
      if(actionResult == null) {
        res.status(204).send();
      } else {
        if (actionResult.success) {
          res.status(actionResult.type || 200)
             .set('Content-Type', actionResult.data ? 'application/json' : 'text/plain')
             .send(JSON.stringify(actionResult.data || actionResult.message))
        } else {
          res.status(actionResult.type || 400)
             .set('Content-Type', actionResult.data ? 'application/json' : 'text/plain')
             .send(JSON.stringify(actionResult.data || actionResult.message))
        }
      }
    } catch (ex) {
      console.log(ex);
      this.handleException(ex, res);
    }
  }

  handleException(ex: Error | Exception, res: Response<unknown, Record<string, unknown>>): void {
    if (ex instanceof Exception) {
      console.log(ex);
      res.status(400).send(ex.formattedMessage);
    } else {
      res.status(500).send(ex.toString());
    }
  }

  async sleep(ms: number) : Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, ms))
  }
}

export interface IPageParams {
  page: number; 
  perPage: number;
}

export interface IRequestParams {
  paging: IPageParams;
  order: IOrderBy;
  filter: IFilter;
}
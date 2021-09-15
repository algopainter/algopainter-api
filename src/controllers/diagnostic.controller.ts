/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router } from "express";
import BaseController from "./base.controller"
import { routesExtractor } from '../shared/routes'

class DiagnosticController extends BaseController {
  private app: express.Application;
  private routes: Record<string, string>[] | null = null

  constructor(app: express.Application) {
    super();
    this.app = app;
  }

  get path(): string {
    return "/diagnostics"
  }

  private _translateRoutes(router: Router): any[] {
    return routesExtractor(router);
  }

  intializeRoutes(router: Router): void {
    this.routes = this._translateRoutes(router);

    router.get(`${this.path}`, async (req, res) => {
      res.status(200)
        .set('Content-Type', 'text/html')
        .send(`
          <!DOCTYPE html>
          <html>
          <head>
          </head>
          <body style='font-family: Consolas'>
            <h1>AlgoPainter - Diagnostics</h1>
            <h2>API v1.10.73 - Endpoints</h2>
            <ul>
              ${this.routes?.map((item) => `<li><b>${item.method}</b> /api${item.path}</li>`)?.join('')}
            </ul>
            </body>
          </html>`)
    });

    router.get(`${this.path}/seed/:secret/fix`, async (req, res) => {
      if (req.params.secret === 'AlgoPainter') {        
        res.status(200).send('Data fixed!');
      }
      res.status(404).send();
    });
  }
}

export default DiagnosticController;
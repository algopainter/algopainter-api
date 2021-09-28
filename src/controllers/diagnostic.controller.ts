/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router } from "express";
import BaseController from "./base.controller";
import { routesExtractor } from '../shared/routes';
import { SettingsContext } from '../domain/settings';
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
            <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css' />	
          </head>
          <body class="d-flex h-100">
            <div class="cover-container d-flex h-100 p-3 mx-auto flex-column" style='width: 50%'>
              <header class="mb-auto">
                <div>
                  <h3 class="float-md-start mb-0">AlgoPainter - API v1.11.76</h3>
                  <nav class="nav nav-masthead justify-content-center float-md-end">
                    <a class="nav-link active" aria-current="page" href="#">Diagnostics</a>
                  </nav>
                </div>
              </header>

              <main class="">
                <h5>GETs</h5>
                <table class='table table-striped'>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                  </tr>
                  ${this.routes?.filter(a => a.method == 'GET').map((item) => `
                    <tr>
                      <td>${item.method}</td>
                      <td><a href='#' onClick="window.open(location.origin + '/api${item.path}', '_blank').focus();">/api${item.path}<a></td>
                    </tr>`)?.join('')}
                </table>
                <h5>POSTs</h5>
                <table class='table table-striped'>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                  </tr>
                  ${this.routes?.filter(a => a.method == 'POST').map((item) => `
                    <tr>
                      <td>${item.method}</td>
                      <td>/api${item.path}</td>
                    </tr>`)?.join('')}
                  </table>
                <h5>PUTs</h5>
                <table class='table table-striped'>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                  </tr>
                  ${this.routes?.filter(a => a.method == 'PUT').map((item) => `
                    <tr>
                      <td>${item.method}</td>
                      <td>/api${item.path}</td>
                    </tr>`)?.join('')}
                </table>
                <h5>DELETEs</h5>
                <table class='table table-striped'>
                  <tr>
                    <th>Method</th>
                    <th>Endpoint</th>
                  </tr>
                  ${this.routes?.filter(a => a.method == 'DELETE').map((item) => `
                    <tr>
                      <td>${item.method}</td>
                      <td>/api${item.path}</td>
                    </tr>`)?.join('')}
                </table>
              </main>

              <footer class="mt-auto">
                <p>AlgoPainter, by <a href="https://www.criptonomia.com/">Criptonomia</a>.</p>
              </footer>
            </div>
            <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.min.js'></script>
          </body>
          </html>`)
    });

    router.get(`${this.path}/seed/:secret/fix`, async (req, res) => {
      if (req.params.secret === 'AlgoPainter') {
        await SettingsContext.create({
          smartcontracts: [
            {
              address: '0xc6e1cb3482add6fb7c2f7b011dfc0448accfaac9',
              name: 'AlgoPainterAuctionSystem'
            }
          ]
        });

        res.status(200).send('Data fixed!');
      }
      res.status(404).send();
    });
  }
}

export default DiagnosticController;
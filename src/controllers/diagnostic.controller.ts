/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router } from "express";
import BaseController from "./base.controller";
import { routesExtractor } from '../shared/routes';
import { SettingsContext } from '../domain/settings';
import AuctionsABI from "../contracts/ABI-AuctionSystem.json";
import AuctionsRewardsABI from "../contracts/ABI-AuctionsRewardsSystem.json";
import AuctionsBidBackPIRSABI from "../contracts/ABI-AuctionsBidBackPIRS.json";
import GweiABI from "../contracts/ABI-GWEI.json";
import ExpressionsABI from "../contracts/ABI-EXPRESSIONS.json";
import AlgopABI from "../contracts/ABI-ERC20.json";

class DiagnosticController extends BaseController {
  private app: express.Application;
  private routes: Record<string, string>[] | null = null
  private version = 'v1.13.0';

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
                  <h3 class="float-md-start mb-0">AlgoPainter - API ${this.version}</h3>
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
        await SettingsContext.remove();

        await SettingsContext.create({
          smartcontracts: [
            {
              address: '0xb8b87531b1bc7aa0b742bea4ddcd98631ca89498',
              name: 'AlgoPainterAuctionSystem',
              symbol: 'APAS',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 13420884,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: AuctionsABI,
              inUse: true
            },
            {
              address: '0xab06be2da3d164b3622cb116b19488f4a71b3bd1',
              name: 'AlgoPainterRewardsSystem',
              symbol: 'APRS',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 13420884,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: AuctionsRewardsABI,
              inUse: true
            },
            {
              address: '0x47edab2a13482006dde78d68236c423b927a6ca3',
              name: 'AlgoPainterBidBackPirs',
              symbol: 'APBPS',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 13420884,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: AuctionsBidBackPIRSABI,
              inUse: true
            },
            {
              address: '0x8cfd89020019ba3da8b13cc2f3e0e5baaf82f578',
              name: 'AlgoPainterGweiItem',
              symbol: 'APGI',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 12198014,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: GweiABI,
              inUse: false
            },
            {
              address: '0xbe9cac059835236da5e91cd72688c43886b63419',
              name: 'AlgoPainterExpressionsItem',
              symbol: 'APEXPI',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 13420884,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: ExpressionsABI,
              inUse: true
            },
            {
              address: '0x01a9188076f1231df2215f67b6a63231fe5e293e',
              name: 'AlgoPainterToken',
              symbol: 'ALGOP',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 13420884,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: AlgopABI,
              inUse: true
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
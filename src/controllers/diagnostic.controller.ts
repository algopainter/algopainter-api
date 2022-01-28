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
  private version = 'v1.14.1';

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
      if (req.params.secret === 'AlgoPainterTestNet') {
        await SettingsContext.remove();

        await SettingsContext.create({
          tokens: [
            {
              value: '1',
              label: 'BTCB',
              tokenAddress: '0x6ce8da28e2f864420840cf74474eff5fd80e65b8',
              decimalPlaces: 18,
              img: '/images/BTC.svg',
            },
            {
              value: '3',
              name: 'AlgoPainter Token',
              tokenAddress: '0x01a9188076f1231df2215f67b6a63231fe5e293e',
              label: 'ALGOP',
              decimalPlaces: 18,
              img: '/images/ALGOP.svg'
            },
            {
              value: '6',
              name: 'DAI',
              tokenAddress: '0xec5dcb5dbf4b114c9d0f65bccab49ec54f6a0867',
              label: 'DAI',
              decimalPlaces: 18,
              img: '/images/DAI.svg'
            }
          ],
          smartcontracts: [
            {
              address: '0x5c35a85636d691eacd66d3d2c8a0f57f3ea13530',
              name: 'AlgoPainterAuctionSystem',
              symbol: 'APAS',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 14569098,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: AuctionsABI,
              inUse: true
            },
            {
              address: '0x7279c3c7b02c7ea2d458114f60df8e5d1a57de29',
              name: 'AlgoPainterRewardsSystem',
              symbol: 'APRS',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 14569118,
              blockExplorer: 'https://testnet.bscscan.com/',
              abi: AuctionsRewardsABI,
              inUse: true
            },
            {
              address: '0x355528b5a623f9bd7e7c19d2fd883de78158e765',
              name: 'AlgoPainterBidBackPirs',
              symbol: 'APBPS',
              network: '97',
              rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545',
              startingBlock: 14569107,
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
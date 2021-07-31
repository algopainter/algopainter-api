/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router } from "express";
import BaseController from "./base.controller"
import { routesExtractor } from '../shared/routes'
import AuctionService from "../services/auction.service";
import CollectionService from "../services/collection.service";
import ImageService from "../services/image.service";
import { auctionData, collectionData, imagesData } from '../reference'

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
            <h2>API - Endpoints</h2>
            <ul>
              ${this.routes?.map((item) => `<li><b>${item.method}</b> /api${item.path}</li>`)?.join('')}
            </ul>
            </body>
          </html>`)
    });

    router.get(`${this.path}/seed/:secret`, async (req, res) => {
      if (req.params.secret === 'AlgoPainter') {
        const auctionService = new AuctionService();
        const collectionService = new CollectionService();
        const imageService = new ImageService();

        let imageCreated: any = await imageService.createAsync(imagesData("Gwei"));

        for (let index = 0; index < 20; index++) {
          await auctionService.createAsync(auctionData(imageCreated.data['_id'], index % 2 == 0, "Gwei"));
          await this.sleep(1000);
        }

        await collectionService.createAsync(collectionData('Gwei', imageCreated.data['_id']));
        await this.sleep(1000);

        imageCreated = await imageService.createAsync(imagesData("Expressions"));
        await collectionService.createAsync(collectionData('Expressions', imageCreated.data['_id']));
        await this.sleep(1000);
        
        imageCreated = await imageService.createAsync(imagesData("Monero"));
        await collectionService.createAsync(collectionData('Monero', imageCreated.data['_id']));

        res.status(200).send('Data created!');
      } else {
        res.status(404).send();
      }
    });
  }
}

export default DiagnosticController;
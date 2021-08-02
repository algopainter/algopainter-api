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

        const gweiImages = [];
        for (let index = 0; index < 10; index++) {
          const newImage: any = await imageService.createAsync(imagesData("Gwei"));
          await this.sleep(500);
          gweiImages.push(newImage.data);
          await auctionService.createAsync(auctionData(newImage.data['_id'], index % 2 == 0, "Gwei"));
          await this.sleep(500);
        }

        await collectionService.createAsync(collectionData('Gwei', gweiImages));
        await this.sleep(500);

        const expressionsImages = [];
        for (let index = 0; index < 10; index++) {
          const newImage: any = await imageService.createAsync(imagesData("Expressions"));
          await this.sleep(500);
          expressionsImages.push(newImage.data);
          await auctionService.createAsync(auctionData(newImage.data['_id'], index % 2 == 0, "Expressions"));
          await this.sleep(500);
        }

        await collectionService.createAsync(collectionData('Expressions', expressionsImages));
        await this.sleep(500);

        const moneroImages = [];
        for (let index = 0; index < 10; index++) {
          const newImage: any = await imageService.createAsync(imagesData("Monero"));
          await this.sleep(500);
          moneroImages.push(newImage.data);
          await auctionService.createAsync(auctionData(newImage.data['_id'], index % 2 == 0, "Monero"));
          await this.sleep(500);
        }
        
        await collectionService.createAsync(collectionData('Monero', moneroImages));

        res.status(200).send('Data created!');
      } else {
        res.status(404).send();
      }
    });
  }
}

export default DiagnosticController;
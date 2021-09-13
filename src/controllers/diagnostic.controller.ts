/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Router } from "express";
import BaseController from "./base.controller"
import { routesExtractor } from '../shared/routes'
import AuctionService from "../services/auction.service";
import CollectionService from "../services/collection.service";
import BidService from "../services/bid.service";
import ImageService from "../services/image.service";
import { auctionData, bidsData } from '../reference'
import { IImage, ImageContext } from "../domain/image";
import { AuctionDocument } from "../domain/auction";
import { Types } from "mongoose";

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
            <h2>API v1.10.71 - Endpoints</h2>
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

    router.get(`${this.path}/seed/:secret`, async (req, res) => {
      if (req.params.secret === 'AlgoPainter') {
        const auctionService = new AuctionService();
        const collectionService = new CollectionService();
        const imageService = new ImageService();
        const bidService = new BidService();

        const rndAcc = function() {
          const accounts = [
            '0x72CF9eAb1A629bddA03a93fA422795fFC8cc2660'.toLowerCase(),
            '0x08a9b7Fc864CF87c4A5Cc82a7F6450CDe32e60A5'.toLowerCase(),
            '0x2a28593abB56B0F425FED25d4Dcc0ff7DDDedABf'.toLowerCase(),
            '0xCAbea325744D9524Fe3CaC533996c144B0FC275c'.toLowerCase(),
            '0x4E9F8B25Ea6007ef3E7e1d195d4216C6dC04a5d2'.toLowerCase(),
            '0xD804c94c7Ed47b97809394E988E447AC66B78DF3'.toLowerCase(),
          ];

          return accounts[Math.floor(Math.random() * accounts.length)].toLowerCase();
        }

        const gweiCollection = '0x4b7ef899cbb24689a47a66d3864f57ec13e01b35'.toLowerCase();
        const gweiImages = (await imageService.getByCollectionOwnerAsync(gweiCollection)).data as IImage[];

        for (let index = 0; index < 15; index++) {
          const acc = rndAcc();
          const newImage: IImage = gweiImages[Math.floor(Math.random() * gweiImages.length)];
          const auction = await auctionService.createAsync(auctionData(
            (newImage as any)._id, 
            newImage.likes, 
            index % 2 == 0, 
            "Gwei", 
            acc, rndAcc(),
            newImage.nft.previewImage,
            newImage.title
          ));
          await this.sleep(500);
          await bidService.createAsync(bidsData(
            acc, 
            (newImage as any)._id, 
            newImage.title, 
            newImage.nft.previewImage, 
            (auction.data as AuctionDocument)._id));
          await this.sleep(500);
        }

        const expressionsCollection = '0xb413ccfd8e7d75d8642c81ab012235fedd946eeb'.toLowerCase();
        const expressionsImages = (await imageService.getByCollectionOwnerAsync(expressionsCollection)).data as IImage[];

        for (let index = 0; index < 15; index++) {
          const acc = rndAcc();
          const newImage: IImage = expressionsImages[Math.floor(Math.random() * expressionsImages.length)];
          const auction = await auctionService.createAsync(auctionData(
            (newImage as any)._id, 
            newImage.likes, 
            index % 2 == 0, 
            "Expressions", 
            acc, rndAcc(),
            newImage.nft.previewImage,
            newImage.title
          ));
          await this.sleep(500);
          await bidService.createAsync(bidsData(
            acc, 
            (newImage as any)._id, 
            newImage.title, 
            newImage.nft.previewImage, 
            (auction.data as AuctionDocument)._id));
          await this.sleep(500);
        }

        res.status(200).send('Data created!');
      } else {
        res.status(404).send();
      }
    });
  }
}

export default DiagnosticController;
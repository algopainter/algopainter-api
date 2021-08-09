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
            <h2>API - Endpoints</h2>
            <ul>
              ${this.routes?.map((item) => `<li><b>${item.method}</b> /api${item.path}</li>`)?.join('')}
            </ul>
            </body>
          </html>`)
    });

    router.get(`${this.path}/seed/:secret/fix`, async (req, res) => {
      if (req.params.secret === 'AlgoPainter') {
        const gweiAvatar = 'data:image/png;base64,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';
        const gweiAccoun = '0x7dDFb53887D2EB323CE0409E792759F916B0e229'.toLowerCase();
      
        await ImageContext.updateMany(
          { 
            creator: gweiAccoun,
            users: {
              $elemMatch: {
                account: gweiAccoun
              }
            }
          }, 
          { 
            'users.$.avatar' : gweiAvatar 
          });
        
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

        const gweiCollection = '0x7dDFb53887D2EB323CE0409E792759F916B0e229'.toLowerCase();
        await collectionService.createAsync({
          description: "Hashily Gwei",
          owner: gweiCollection,
          title: 'Gwei'
        });
        const gweiImages = (await imageService.getByCreatorAsync(gweiCollection)).data as IImage[];

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

        res.status(200).send('Data created!');
      } else {
        res.status(404).send();
      }
    });
  }
}

export default DiagnosticController;
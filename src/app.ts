import express, { Router } from 'express';
import bodyParser from 'body-parser';
import BaseController from './controllers/base.controller'
import AuctionController from './controllers/auction.controller'
import CollectionController from './controllers/collection.controller'
import DiagnosticController from './controllers/diagnostic.controller'
import ImageController from './controllers/image.controller'
import NFTController from './controllers/nft.controller'
import ReportController from './controllers/report.controller'
import UserController from './controllers/user.controller'
import cors from 'cors';
import SignService from './services/sign.service';
import { disconnect } from 'mongoose';

class Application {
  public app: express.Application;
  public port: number;
  public router: Router;
 
  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.router = express.Router();
 
    this.initializeMiddlewares();
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(async (req, res, next) => { 
      const signService = new SignService();
      await signService.connect();
      const result = await signService.validatePreRequest(req.body);
      await disconnect();
      if(result === null || result === true)
        next();
      else
        res.status(409)
        .set('X-Powered-By', 'AlgoPainter')
        .send('Unable to continue with the Request, the data may have conflicts.');
    })
    this.app.use('/api', this.router); // Netlify redirects
    this.app.use('/', (req, res) => res.status(200).send('AlgoPainter - API'));
  }
 
  public initializeControllers(controllers : BaseController[]) {
    controllers.forEach((controller) => {
      controller.intializeRoutes(this.router);
    });
  }
 
  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  public get expressApp() : express.Application {
    return this.app;
  }
}

const App : Application = new Application(3000);
App.initializeControllers([
  new CollectionController(),
  new ImageController(),
  new NFTController(),
  new ReportController(),
  new UserController(),
  new AuctionController(),
  new DiagnosticController(App.expressApp),
]);

export default App;
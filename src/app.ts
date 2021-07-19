import express, { Router } from 'express';
import bodyParser from 'body-parser';
import { BaseController } from './controllers/base-controller'
import AuctionController from './controllers/auction-controller'

class Application {
  public app: express.Application;
  public port: number;
  public router: Router;
 
  constructor(controllers: BaseController[], port: number) {
    this.app = express();
    this.port = port;
    this.router = express.Router();
 
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }
 
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use('/api', this.router); // Netlify redirects
    this.app.use('/.netlify/functions/server', this.router); // Netlify redirects
  }
 
  private initializeControllers(controllers : BaseController[]) {
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

const App : Application = new Application([
  new AuctionController()
], 3000);

export default App;
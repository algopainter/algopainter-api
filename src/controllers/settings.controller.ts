import { AnyAaaaRecord } from "dns";
import { Router } from "express";
import { SettingsContext, SettingsDocument } from "../domain/settings";
import Result from "../shared/result";
import BaseController from "./base.controller"

class SettingsController extends BaseController {
  constructor() {
    super();
  }

  get path(): string {
    return "/settings"
  }

  intializeRoutes(router: Router): void {
    router.get(`${this.path}`, async (req, res) => {
      try {
        const settings = await SettingsContext.findOne() as any;
        this.handleResult(Result.success<SettingsDocument>(null, settings), res);
      } catch (error) {
        this.handleException(error, res);
      }
    });

    router.get(`${this.path}/script.js`, async (req, res) => {
      try {
        const settings = ((await SettingsContext.findOne()) as any)['_doc'];

        if (settings) {
          delete settings['_id'];
          delete settings['__v'];
        } else {
          throw 'Settings not found.';
        }

        const script = `
window['algop'] = {};
window['algop']['settings'] = JSON.parse('${JSON.stringify(settings)}');
window['algop']['getSmartContractByName'] = function(name) {
  var s = window.algop.settings;
  var config = s.smartcontracts.filter(a => a.name === name);

  if(config.length)
    return config[0];
  throw new Error('The config with ' + name + ' does not exists.');
}
window['algop']['AlgoPainterAuctionSystem'] = window.algop.getSmartContractByName('AlgoPainterAuctionSystem').address;
window['algop']['AlgoPainterRewardsSystem'] = window.algop.getSmartContractByName('AlgoPainterRewardsSystem').address;
window['algop']['AlgoPainterBidBackPirs'] = window.algop.getSmartContractByName('AlgoPainterBidBackPirs').address;
window['algop']['AlgoPainterGweiItem'] = window.algop.getSmartContractByName('AlgoPainterGweiItem').address;
window['algop']['AlgoPainterExpressionsItem'] = window.algop.getSmartContractByName('AlgoPainterExpressionsItem').address;
window['algop']['AlgoPainterToken'] = window.algop.getSmartContractByName('AlgoPainterToken').address;
`;

        res.set('X-Powered-By', 'AlgoPainter').set('Content-Type', 'application/javascript').send(script);
      } catch (error) {
        this.handleException(error, res);
      }
    });
  }
}

export default SettingsController;
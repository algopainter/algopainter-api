import { UserContext } from "../domain/user";
import { IBuyer } from "../reporting/buyers";
import { ISeller } from "../reporting/sellers";
import Result from "../shared/result";
import { BaseService } from "./base.service";

export default class ReportService extends BaseService {
  async topSellers() : Promise<Result<ISeller[]>> {
    const users = await UserContext.find({ type: { $ne: 'algop' } });
    const reportTopSellers: ISeller[] = [];

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      reportTopSellers.push({
        name: user.nick || user.name,
        amount: Math.floor(Math.random() * 10001),
        account: user.account,
        avatar: user.avatar || '',
        tokenSymbol: 'ETH'
      });
    }

    reportTopSellers.sort((a, b) => {
      if (a.amount > b.amount) {
        return -1;
      }
      if (a.amount < b.amount) {
        return 1;
      }
      return 0;
    });

    return Result.success<ISeller[]>(null, reportTopSellers.slice(0, Math.min(5, reportTopSellers.length)));
  }

  async topBuyers() : Promise<Result<IBuyer[]>> {
    const users = await UserContext.find({ type: { $ne: 'algop' } });
    const reportTopSellers: IBuyer[] = [];

    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      reportTopSellers.push({
        name: user.nick || user.name,
        amount: Math.floor(Math.random() * 10001),
        account: user.account,
        avatar: user.avatar || '',
        tokenSymbol: 'USD'
      });
    }

    reportTopSellers.sort((a, b) => {
      if (a.amount > b.amount) {
        return -1;
      }
      if (a.amount < b.amount) {
        return 1;
      }
      return 0;
    });

    return Result.success<IBuyer[]>(null, reportTopSellers.slice(0, Math.min(5, reportTopSellers.length)));
  }
}
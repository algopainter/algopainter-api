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
        avatar: user.avatar || 'https://freeiconshop.com/wp-content/uploads/edd/person-outline-filled.png',
        tokenSymbol: 'ETH'
      });
    }

    return Result.success<ISeller[]>(null, reportTopSellers);
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
        avatar: user.avatar || 'https://freeiconshop.com/wp-content/uploads/edd/person-outline-filled.png',
        tokenSymbol: 'ETH'
      });
    }

    return Result.success<IBuyer[]>(null, reportTopSellers);
  }
}
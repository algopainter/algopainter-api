import { IBuyer } from "../reporting/buyers";
import { ISeller } from "../reporting/sellers";
import Result from "../shared/result";
import { BaseService } from "./base.service";

export default class ReportService extends BaseService {
  topSellers() : Result<ISeller[]> {
    return Result.success(null, [
      {
        name: 'Gleisson',
        amount: 912804.92,
        avatar: 'https://avatars.githubusercontent.com/u/5391579?v=4',
        tokenSymbol: 'USD'
      },
      {
        name: 'Lincoln',
        amount: 39902.92,
        avatar: 'https://avatars.githubusercontent.com/u/84987905?v=4',
        tokenSymbol: 'USD'
      },
      {
        name: 'Julio',
        amount: 948.92,
        avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
        tokenSymbol: 'USD'
      },
      {
        name: 'Jesse',
        amount: 232.92,
        avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
        tokenSymbol: 'USD'
      },
      {
        name: 'Isaac',
        amount: 23.92,
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        tokenSymbol: 'USD'
      },
    ]);
  }

  topBuyers() : Result<IBuyer[]> {
    return Result.success(null, [
      {
        name: 'Lincoln',
        amount: 912804.92,
        avatar: 'https://avatars.githubusercontent.com/u/5391579?v=4',
        tokenSymbol: 'USD'
      },
      {
        name: 'Gleisson',
        amount: 39902.92,
        avatar: 'https://avatars.githubusercontent.com/u/84987905?v=4',
        tokenSymbol: 'USD'
      },
      {
        name: 'Jesse',
        amount: 948.92,
        avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
        tokenSymbol: 'USD'
      },
      {
        name: 'Julio',
        amount: 232.92,
        avatar: 'https://randomuser.me/api/portraits/men/64.jpg',
        tokenSymbol: 'USD'
      },
      {
        name: 'Isaac',
        amount: 23.92,
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        tokenSymbol: 'USD'
      },
    ]);
  }
}
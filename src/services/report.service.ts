import { UserContext } from "../domain/user";
import { IBuyer } from "../reporting/buyers";
import { ISeller } from "../reporting/sellers";
import Result from "../shared/result";
import { BaseService } from "./base.service";
import { AuctionReport, AuctionUserReport, MintReport } from "../reporting/deals"
import { ImageContext } from "../domain/image";
import { CollectionContext } from "../domain/collection";
import { AuctionContext } from "../domain/auction";
import { GLContext } from "../domain/gl";

export default class ReportService extends BaseService {
  async artistMints(artist: string) : Promise<Result<MintReport[]>> {
    let data : MintReport[] = [];
    
    const artistCollections = (await CollectionContext.find({
      owner: artist.toLowerCase()
    }, {
      blockchainId: 1
    })).map(a => a.blockchainId.toString());

    const minus90Days = new Date(new Date().getTime() - (90 * 86400 * 1000));
    
    const nfts = await ImageContext.find({
      createdAt: { $gt: minus90Days },
      collectionId: { $in: artistCollections }
    }, {
      nft: 1,
      collectionName: 1,
      pirs: 1,
      initialPrice: 1,
      title: 1,
      onSale: 1
    });

    if(nfts && nfts.length > 0) {
      data = nfts.map(a => {
        return <MintReport>{
          collection: a.collectionName,
          creator: ((a.pirs.creatorRate || 0)/100).toString() + '%',
          amount: a.initialPrice?.amount ? `${a.initialPrice?.amount.toString()} ${a.initialPrice?.tokenSymbol}` : '',
          nft: "#" + a.nft.index + ' ' + a.title,
          onSale: a.onSale
        }
      });
    }
    
    return Result.success<MintReport[]>(null, data);
  }

  async artistAuctions(artist: string) : Promise<Result<AuctionReport[]>> {
    let data : AuctionReport[] = [];
    
    const artistCollections = (await CollectionContext.find({
      $or: [
        { owner: artist.toLowerCase() },
        { owner: artist }
      ]
    }, {
      blockchainId: 1,
      title: 1
    }));

    if(!artistCollections)
      return Result.success<AuctionReport[]>(null, data);

    const minus90Days = new Date(new Date().getTime() - (90 * 86400 * 1000));
    
    const nfts = await ImageContext.find({
      collectionId: { $in: artistCollections.map(a => a.blockchainId.toString()) }
    }, {
      nft: 1,
      collectionId: 1,
      collectionOwner: 1,
    });

    if(nfts && nfts.length > 0) {
      const auctions = await AuctionContext.find({
        "item.collectionOwner": nfts[0].collectionOwner,
        "item.index": { $in: nfts.map(a => a.nft.index) },
        startDt: { $gt: minus90Days }
      }, {
        index: 1,
        item: 1,
        updatedAt: 1,
        check: 1,
        minimumBid: 1,
        ended: 1,
        expirationDt: 1
      })

      if(auctions && auctions.length > 0) {
        data = auctions.map(a => {
          return <AuctionReport>{
            index: a.index,
            amount: a.check?.net ? `${a.check?.net.toString()} ${a.minimumBid?.tokenSymbol}` : '',
            collection: artistCollections.find(
              z => z.blockchainId.toString() == nfts.find(
                s => s.nft.index == a.item.index)?.collectionId)?.title,
            creator: a.check?.creator ? (a.check.creator.toString() + ' ' + a.minimumBid?.tokenSymbol) : '',
            nft: a.item.index + ' ' + a.item.title,
            sellDT: a.ended ? a.updatedAt : undefined,
            toClaim: !a.ended && a.expirationDt.getTime() <= new Date().getTime()
          }
        });
      }
    }
    
    return Result.success<AuctionReport[]>(null, data);
  }

  async userAuctions(user: string) : Promise<Result<AuctionReport[]>> {
    let data : AuctionReport[] = [];

    const minus90Days = new Date(new Date().getTime() - (90 * 86400 * 1000));

    const pirsQuery: any = {};
    const bidbacksQuery: any = {};

    pirsQuery["pirshare." + user.toLowerCase()] = { $gte: 0 };
    bidbacksQuery["bidbackshare." + user.toLowerCase()] = { $gte: 0 };

    const auctions = await AuctionContext.find({
      startDt: { $gt: minus90Days },
      $or: [
        { owner: user.toLowerCase() },
        { "bids.bidder": user.toLowerCase() },
        { "highestBid.account": user },
        { ...pirsQuery },
        { ...bidbacksQuery }
      ]
    }, {
      index: 1,
      item: 1,
      updatedAt: 1,
      check: 1,
      minimumBid: 1,
      ended: 1,
      expirationDt: 1,
      highestBid: 1,
      pirs: 1,
      bidbacks: 1,
      owner: 1,
      fee: 1
    });

    const claimedBidbacks = (await GLContext.find({
      account : user.toLowerCase(),
      type : 'bidbackclaimed',
      $or: [
        ...auctions.map(a => { return { auction: a.index } } )
      ]
    }, {
      amount: 1,
      account: 1,
      auction: 1
    })).map(a => {
      return {
        auction: a.auction,
        account: a.account,
        amount: a.amount,
      };
    });

    const claimedPirs = (await GLContext.find({
      account : user.toLowerCase(),
      type : 'pirclaimed',
      $or: [
        ...auctions.map(a => { return { auction: a.index } } )
      ]
    }, {
      amount: 1,
      account: 1,
      auction: 1
    })).map(a => {
      return {
        auction: a.auction,
        account: a.account,
        amount: a.amount,
      };
    });

    const findBidback = (auction: number, symbol?: string) => {
      if(claimedBidbacks && claimedBidbacks.length > 0) {
        for (let i = 0; i < claimedBidbacks.length; i++) {
          const element = claimedBidbacks[i];
          if(element.account === user.toLowerCase() && element.auction === auction)
            return (element.amount / Math.pow(10, 18)).toFixed(2) + ' ' + symbol;
        }
      }
      return '';
    };

    const findPirs = (auction: number, symbol?: string) => {
      if(claimedPirs && claimedPirs.length > 0) {
        for (let i = 0; i < claimedPirs.length; i++) {
          const element = claimedPirs[i];
          if(element.account === user.toLowerCase() && element.auction === auction)
            return (element.amount / Math.pow(10, 18)).toFixed(2) + ' ' + symbol;
        }
      }
      return '';
    };

    if(auctions && auctions.length > 0) {
      data = auctions.map(a => {
        
        const value = <AuctionUserReport>{
          index: a.index,
          bidBackRate: a.fee.bidbackRate / 100,
          amount: (a.check?.net && a.owner == user.toLowerCase()) ? `${a.check?.net.toFixed(2)} ${a.minimumBid?.tokenSymbol}` : '',
          collection: a.item.collectionName,
          creator: a.check?.creator ? (a.check.creator.toFixed(2) + ' ' + a.minimumBid?.tokenSymbol) : '',
          nft: a.item.index + ' ' + a.item.title,
          sellDT: a.ended ? a.updatedAt : undefined,
          toClaim: !a.ended && a.expirationDt.getTime() <= new Date().getTime(),
          lastBid: a.highestBid?.netAmount ? (a.highestBid?.netAmount / Math.pow(10, 18)).toFixed(2) + ' ' + a.minimumBid?.tokenSymbol : '',
          bidback: findBidback(a.index, a.minimumBid?.tokenSymbol),
          pirs: findPirs(a.index, a.minimumBid?.tokenSymbol)
        };

        return value;
      });
    }
    
    return Result.success<AuctionReport[]>(null, data);
  }

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
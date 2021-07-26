import { model, Schema, Model, Document } from 'mongoose';
import { IUser } from './user';

export interface IAuctionUser extends IUser {
  _id: string;
}

export interface IBid {
  amount: number;
  tokenSymbol: string;
  createdAt: Date;
  bidder?: IAuctionUser | null;
}

export interface IAuctionItem {
  _id: string;
  likes: number;
  title: string;
  previewImageUrl: string;
  tags: string[]
}

export interface IAuctionRoyality {
  value: number;
  type: 'creator' | 'investor'
}

export interface IAuctionFees {
  bidBack: number;
  royalities: IAuctionRoyality[];
  service: number;
}

export interface AuctionDocument extends Document {
  item: IAuctionItem;
  createdAt: Date;
  updatedAt: Date;
  startDt: Date;
  expirationDt: Date;
  fee: IAuctionFees;
  isHot: boolean;
  users: IAuctionUser[];
  bids: IBid[];
  categories: string[];
  minimumBid: IBid;
  highestBid: IBid;
  lowestBid: IBid;
}

export interface IAuction {
  startDt: AuctionDocument['startDt'];
  expirationDt: AuctionDocument['expirationDt'];
  fee: AuctionDocument['fee'];
  item: AuctionDocument['item'];
  createdAt: AuctionDocument['createdAt'];
  updatedAt: AuctionDocument['updatedAt'];
  isHot: AuctionDocument['isHot'];
  users: AuctionDocument['users'];
  bids: AuctionDocument['bids'];
  minimumBid: AuctionDocument['minimumBid'];
  highestBid: AuctionDocument['highestBid'];
  lowestBid: AuctionDocument['lowestBid'];
  categories: AuctionDocument['categories'];
}

export const AuctionSchema: Schema = new Schema({
  item: { type: Object, required: true },
  fee: { type: Object, required: true },
  startDt: { type: Date, required: true },
  expirationDt: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  isHot: { type: Boolean, required: true },
  users: { type: [Object], required: true },
  bids: { type: [Object], required: false },
  minimumBid: { type: Object, required: false },
  highestBid: { type: Object, required: false },
  lowestBid: { type: Object, required: false },
  categories: { type: [String], required: true },
});

export const AuctionContext: Model<AuctionDocument> = model('auctions', AuctionSchema);
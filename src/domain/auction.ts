import { model, Schema, Model, Document } from 'mongoose';
import { IUser, UserSchema } from './user';

export interface IAuctionUser extends IUser {
  id: string;
}

export interface IBid {
  amount: number;
  tokenSymbol: string;
  type: "bid" | "minimum" | "lowest" | "highest";
  createdAt: Date;
  bidder?: IAuctionUser | null;
}

export interface IAuctionItem {
  id: string;
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
  likes: number;
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
}

export interface IAuction {
  likes: AuctionDocument['likes'];
  startDt: AuctionDocument['startDt'];
  expirationDt: AuctionDocument['expirationDt'];
  fee: AuctionDocument['fee'];
  item: AuctionDocument['item'];
  createdAt: AuctionDocument['createdAt'];
  updatedAt: AuctionDocument['updatedAt'];
  isHot: AuctionDocument['isHot'];
  users: AuctionDocument['users'];
  bids: AuctionDocument['bids'];
  categories: AuctionDocument['categories'];
}

export const AuctionSchema: Schema = new Schema({
  likes: { type: Number, required: true },
  item: { type: Object, required: true },
  fee: { type: Object, required: true },
  startDt: { type: Date, required: true },
  expirationDt: { type: Date, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  isHot: { type: Boolean, required: true },
  users: { type: [Object], required: true },
  bids: { type: [Object], required: false },
  categories: { type: [String], required: true },
});

export const AuctionContext: Model<AuctionDocument> = model('auctions', AuctionSchema);
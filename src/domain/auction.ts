import { model, Schema, Model, Document } from 'mongoose';
import { IUser, UserSchema } from './user';

export interface IBid {
  amount: number;
  tokenSymbol: string;
  type: "bid" | "minimum" | "lowest" | "highest";
  createdAt: Date;
  bidder?: IUser | null;
}

export interface IAuctionItem {
  title: string;
  previewImageUrl: string;
  tags: string[]
}

export class AuctionDocument extends Document {
  likes: number;
  item: IAuctionItem;
  createdAt: Date;
  updatedAt: Date;
  isHot: boolean;
  users: IUser[];
  bids: IBid[];
  categories: string[];
}

export interface IAuction {
  likes: AuctionDocument['likes'];
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
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: false },
  isHot: { type: Boolean, required: true },
  users: { type: [Object], required: true },
  bids: { type: [Object], required: false },
  categories: { type: [String], required: true },
});

export const AuctionContext: Model<AuctionDocument> = model('auctions', AuctionSchema);